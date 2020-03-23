const express = require('express');
const cheerio = require('cheerio');
const Trade = require('./tradeObjects/Trade');
const Tradable = require('./tradeObjects/Tradable');
const Entity = require('./tradeObjects/Entity');
const axios = require('axios');
const asyncHandler = require('express-async-handler');

const app = express();
const baseURL = "escapefromtarkov.gamepedia.com";

app.get('/api/search', asyncHandler(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const homepageRequestResult = await makeRequest('Escape_from_Tarkov_Wiki');
	const homepageHtml = homepageRequestResult.data;
	const categoryURLs = getCategoryURLs(homepageHtml);
	const result = await getItemNames(categoryURLs);
	res.send(result);
}));

app.get('/api/search/:item', asyncHandler(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const response = await makeRequest(req.params.item);
	const html = response.data;
	res.statusCode = response.status;
	res.send(processHTML(html));
}));

const makeRequest = item => {
	return axios.get(`https://${baseURL}/${item}`);
}

const getCategoryURLs = html => {
	var categoryURLs = [];
	const $ = cheerio.load(html);
	categoryURLs = categoryURLs.concat(getCategoryList($, 'Gear'));
	categoryURLs = categoryURLs.concat(getCategoryList($, 'Items'));
	return categoryURLs;
}

const getCategoryList = ($, headerTitle) => {
	const categoryURLs = [];
	const $header = $(`h3:contains('${headerTitle}')`);
	const $div = $header.next('div.body');
	const $list = $div.find('ul');
	$list.find('li').each((index, li) => {
		categoryURLs.push($(li).find('a').attr('href'));
	});
	return categoryURLs;
}

const getItemNames = async categoryURLs => {
	var itemNames = [];
	for (const categoryURL of categoryURLs) {
		const categoryPageRequest = await makeRequest(categoryURL.substring(1));
		itemNames = itemNames.concat(scanCategoryTables(categoryPageRequest.data));
	}
	return itemNames;
}

const scanCategoryTables = html => {
	var itemNames = [];
	const $ = cheerio.load(html);
	const $tables = $('table.wikitable');
	$tables.each((index, table) => {
		const $table = $(table);
		const nameColumnIndex = $table.find("th:contains('Name')").index();
		$table.find('tr').slice(1).each((index, tr) => {
			const cells = $(tr).children();
			itemNames.push($(cells[nameColumnIndex]).text().trim());
		});
	});
	return itemNames;
}

const processHTML = html => {
	const $ = cheerio.load(html);
	const quest = getListData($, 'Quests');
	const hideout = getListData($, 'Hideout');
	const trading = getTradingData($);
	const crafting = getCraftingData($);

	return { quest, hideout, trading, crafting };
}

const getListData = ($, headerTitle) => {
	var listItems = [];
	const $header = $(`h2:contains(${headerTitle})`);
	const $list = $header.next('ul');
	$list.find('li').each((index, li) => {
		listItems.push($(li).text());
	});
	return listItems;
}

const getTradingData = $ => {
	var trades = [];
	const $tradingHeader = $("h2:contains('Trading')");
	const $tradingTable = $tradingHeader.next('table');
	$tradingTable.find('tr').each(function(index, row) {
		const columns = $(row).find('th');
		if (columns.length === 5) {
			const required = createTradables($, $(columns[0]));
			const entity = createEntity($, $(columns[2]));
			const receivables = createTradables($, $(columns[4]));
			trades.push(new Trade(required, entity, receivables));
		}
	});
	return trades;
}

const getCraftingData = $ => {
	var crafting = [];
	const $craftingHeader = $("h2:contains('Crafting')");
	const $craftingTable = $craftingHeader.next('table');
	$craftingTable.find('tr').each(function(index, row) {
		const columns = $(row).find('th');
		if (columns.length === 5) {
			const required = createTradables($, $(columns[0]));
			const entity = createEntity($, $(columns[2]));
			const receivables = createTradables($, $(columns[4]));
			crafting.push(new Trade(required, entity, receivables));
		}
	});
	return crafting;
}

const createTradables = ($, $th) => {
	var required = [];
	
	const items = $th.html().split('+');
	items.forEach(itemHtml => {
		const firstAnchor = $(itemHtml).closest('a[href]')[0];
		if (firstAnchor) {
			const $firstAnchor = $(firstAnchor);
			const name = $firstAnchor.attr('title');

			const quantityText = $(firstAnchor.nextSibling).text();
			const quantity = (quantityText.match(/x(\d+)/) || [])[1];
			
			const itemImage = $firstAnchor.find('img')[0];
			const imageURL = $(itemImage).attr('src');
			
			required.push(new Tradable(name, quantity, imageURL));
		}
	});

	return required;
}

const createEntity = ($, $th) => {
	var name, requirements, imageURL;
	const anchors = $th.find('a');
	const firstAnchor = anchors[0];
	if (firstAnchor) {
		const $firstAnchor = $(firstAnchor);
		const imageInAnchor = $firstAnchor.find('img');
		if (imageInAnchor.length) {
			name = $firstAnchor.attr('title');
		} else {
			name = $firstAnchor.text();
		}

		const itemImage = imageInAnchor[0];
		imageURL = $(itemImage).attr('src');
	}

	const cellText = getCellText($th).trim();
	const requirementsPrefix = (cellText.match(/After.+task/) || [])[0];
	if (requirementsPrefix) {
		const quest = $(anchors.slice(-1)[0]).attr('title');
		requirements = `${requirementsPrefix} ${quest}`;
	} else if (cellText) {
		requirements = cellText;
	}

	return new Entity(name, requirements, imageURL);
}

const getCellText = ($th) => {
	return $th.clone()	//clone the element
		.children()		//select all the children
		.remove()		//remove all the children
		.end()			//again go back to selected element
		.text();
}

app.listen(3001, () =>
	console.log('Express server is running on localhost:3001')
);