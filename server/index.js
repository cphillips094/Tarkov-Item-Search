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

processHTML = html => {
	var trades = [];
	const $ = cheerio.load(html);
	const $tradingHeader = $("h2:contains('Trading')");
	const $tradingTable = $tradingHeader.next('table');
	$tradingTable.find('tr').each(function(index, row) {
		const columns = $(row).find('th');
		if (columns.length === 5) {
			//console.log("th text: " + $(columns[0]).text());
			const required = createRequired($(columns[0]));
			const entity = new Entity("Peacekeeper", ""); //createEntity($(columns[2]));
			const receivables = [ new Tradable("Folder with Intelligence", 1) ]; //createReceivables($(columns[4]));
			trades.push(new Trade(required, entity, receivables));
			}
	});

	return { trading: trades };
}

createRequired = $th => {
	var result = [];
	var blah;
	const text = $th.text();
	text.split("+").forEach(requirement => {
		const captureGroups = requirement.trim().match(/^(x\d+)*(.+)$/);
		if (captureGroups) {
			if (captureGroups.length === 3) {
				result.push(new Tradable(captureGroups[2].trim(), captureGroups[1].substring(1).trim()));
			} else if (captureGroups.length === 2) {
				result.push(new Tradable(captureGroups[0], 1));
			}
		}
	});
	return result;
}

app.listen(3001, () =>
	console.log('Express server is running on localhost:3001')
);