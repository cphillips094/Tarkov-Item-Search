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
	const itemNames = await getItemNames(categoryURLs);
	res.status(200).send({ items: itemNames });
}));

app.get('/api/search/:item', asyncHandler(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const itemPageResponse = await makeRequest(req.params.item);
	const itemPageHTML = itemPageResponse.data;
	const itemData = processHTML(itemPageHTML);
	res.status(200).send(itemData);
}));

app.use(function(error, req, res, next) {
	if (error.response) {
		console.info(`${error.request.method} request to ${error.request.path} resulted in a ${error.response.status}`)
		res.status(200).json({ quest: [], hideout: [], trading: [], crafting: [] });
	} else {
		console.error(error.stack);
		res.status(500).send({ message: 'An error occurred' })
	}
});

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
		categoryURLs.push($(li).find('a').attr('href').substring(1));
	});
	return categoryURLs;
}

const getItemNames = async categoryURLs => {
	var itemNames = [];
	const specialCases = getItemCategorySpecialCases();
	for (const categoryURL of categoryURLs) {
		const specialCaseFunction = specialCases[categoryURL];
		if (specialCaseFunction) {
			itemNames = itemNames.concat(await specialCaseFunction(categoryURL));
		} else {
			const categoryPageRequest = await makeRequest(categoryURL);
			itemNames = itemNames.concat(scanCategoryTables(categoryPageRequest.data));
		}
	}
	return itemNames;
}

const getItemCategorySpecialCases = () => {
	const specialCases = [];
	specialCases['Ammunition'] = handleAmmunitionCategory;
	return specialCases;
}

const handleAmmunitionCategory = async categoryURL => {
	let itemNames = [];
	const ammoCategoryPageRequest = await makeRequest(categoryURL);
	const ammoPageURLs = scanCategoryTables(ammoCategoryPageRequest.data);
	for (const ammoPageURL of ammoPageURLs) {
		const ammoPageRequest = await makeRequest(ammoPageURL);
		itemNames = itemNames.concat(scanCategoryTables(ammoPageRequest.data));
	}
	return itemNames;
}

const scanCategoryTables = html => {
	var itemNames = [];
	const $ = cheerio.load(html);
	const $tables = $('table.wikitable');
	let tableValid = true;
	$tables.each((index, table) => {
		const $table = $(table);
		tableValid = tableValid && notUpcomingTable($table);
		if (tableValid) {
			const nameColumnIndex = $table.find("th:contains('Name')").index();
			if (nameColumnIndex >= 0) {
				$table.find('tr').slice(1).each((index, tr) => {
					const cells = $(tr).children();
					const itemName = $(cells[nameColumnIndex]).text().trim();
					itemNames.push(itemName);
				});
			}
		}
	});
	return itemNames;
}

const notUpcomingTable = $table => {
	return $table.prevAll("h2:contains('Upcoming')").length === 0;
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
	let required = [];
	const anchors = $th.find('a');
	for (let i = 0; i < anchors.length; i++) {
		const $firstAnchor = $(anchors[i]);
		let $secondAnchor;
		if (isImgAnchor($firstAnchor) !== isImgAnchor($(anchors[i + 1]))) {
			$secondAnchor = $(anchors[++i]);
		}
		required.push(extractDataFromAnchorPair($, $firstAnchor, $secondAnchor));
	}

	return required;
}

const isImgAnchor = $a => {
	return $a.children('img').length > 0;
}

const extractDataFromAnchorPair = ($, $firstAnchor, $secondAnchor) => {
	let name, quantity, imageURL;
	if (isImgAnchor($firstAnchor)) {
		[ quantity, imageURL ] = extractImageAnchorData($, $firstAnchor);
	} else {
		name = $firstAnchor.text().trim();
	}

	if ($secondAnchor) {
		if (isImgAnchor($secondAnchor)) {
			[ quantity, imageURL ] = extractImageAnchorData($, $secondAnchor);
		} else {
			name = $secondAnchor.text().trim();
		}
	}

	return new Tradable(name, quantity, imageURL);
}

const extractImageAnchorData = ($, $anchor) => {
	let quantity, imageURL;
	quantityText = $($anchor[0].nextSibling).text();
	quantity = (quantityText.match(/x(\d+)/) || [])[1];

	const itemImage = $anchor.find('img')[0];
	imageURL = $(itemImage).attr('src');

	return [ quantity, imageURL ];
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