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
	const $ = cheerio.load(html);
	const trading = getTradingData($);

	return { trading: trading };
}

getTradingData = $ => {
	var trades = [];
	const $tradingHeader = $("h2:contains('Trading')");
	const $tradingTable = $tradingHeader.next('table');
	$tradingTable.find('tr').each(function(index, row) {
		const columns = $(row).find('th');
		if (columns.length === 5) {
			const required = createRequired($(columns[0]));
			const entity = new Entity("Peacekeeper", "", "https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/9/95/Peacekeeper_3_icon.png?version=4b828e037d1d3c54d03599e9b70cea92"); //createEntity($(columns[2]));
			const receivables = [ new Tradable("Folder with Intelligence", 1, "https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/8/85/FolderWithIntelligence_Icon.png?version=4e8c8f0dbe5cef4bdd4d6ac97077b644") ]; //createReceivables($(columns[4]));
			trades.push(new Trade(required, entity, receivables));
			}
	});
	return trades;
}

createRequired = $th => {
	var result = [];
	var blah;
	const text = $th.text();
	text.split("+").forEach(requirement => {
		const captureGroups = requirement.trim().match(/^(x\d+)*(.+)$/);
		if (captureGroups) {
			if (captureGroups.length === 3) {
				result.push(new Tradable(captureGroups[2].trim(), captureGroups[1].substring(1).trim(), "https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/e/e5/SlimDiaryIcon.png?version=0cfd28d5c5a226c6c74c4335c020014d"));
			} else if (captureGroups.length === 2) {
				result.push(new Tradable(captureGroups[0], 1, "https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/e/e5/SlimDiaryIcon.png?version=0cfd28d5c5a226c6c74c4335c020014d"));
			}
		}
	});
	return result;
}

app.listen(3001, () =>
	console.log('Express server is running on localhost:3001')
);