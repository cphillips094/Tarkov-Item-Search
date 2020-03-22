const express = require('express');
const cheerio = require('cheerio');
const Trade = require('./tradeObjects/Trade');
const Tradable = require('./tradeObjects/Tradable');
const Entity = require('./tradeObjects/Entity');

const app = express();

const baseURL = "escapefromtarkov.gamepedia.com";

app.get('/api/search', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	makeRequest(req.query.item, (statusCode, result) => {
		res.statusCode = statusCode;
		res.send(processHTML(result));
	});
});

makeRequest = (item, onResult) => {
	let output = '';
	const https = require('https')
	const options = {
		host: baseURL,
		port: 443,
		path: `/${item}`,
		method: 'GET',
	}

	const req = https.request(options, res => {
		console.log(`${options.host} : ${res.statusCode}`);
		res.setEncoding('utf8');

		res.on('data', d => {
			output += d;
		});
		res.on('end', () => {
			onResult(res.statusCode, output);
		});
	});

	req.on('error', error => {
		console.error(error)
	});

	req.end();
}

const processHTML = html => {
	const $ = cheerio.load(html);
	const trading = getTradingData($);

	return { trading: trading };
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

const createTradables = ($, $th) => {
	var required = [];
	
	const items = $th.html().split('+');
	items.forEach(itemHtml => {
		const firstAnchor = $(itemHtml).closest('a')[0];
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
		name = $firstAnchor.attr('title');

		const itemImage = $firstAnchor.find('img')[0];
		imageURL = $(itemImage).attr('src');
	}

	const requirementsPrefix = ($th.text().match(/After.+task/) || [])[0];
	if (requirementsPrefix) {
		const quest = $(anchors.slice(-1)[0]).attr('title');
		requirements = `${requirementsPrefix} ${quest}`;
	}

	return new Entity(name, requirements, imageURL);
}

app.listen(3001, () =>
	console.log('Express server is running on localhost:3001')
);