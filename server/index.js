const express = require('express');
const asyncHandler = require('express-async-handler');
const wikiScraperService = require('./wikiScraperService');

const app = express();

app.get('/api/search/all', asyncHandler(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const homepageRequestResult = await wikiScraperService.makeRequest('Escape_from_Tarkov_Wiki');
	const homepageHtml = homepageRequestResult.data;
	const categoryURLs = wikiScraperService.getCategoryURLs(homepageHtml);
	const itemNames = await wikiScraperService.getItemNames(categoryURLs);
	res.status(200).send({ items: itemNames });
}));

app.get('/api/search/:item', asyncHandler(async (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	const itemPageResponse = await wikiScraperService.makeRequest(req.params.item);
	const itemPageHTML = itemPageResponse.data;
	const itemData = wikiScraperService.processItemHTML(itemPageHTML);
	res.status(200).send(itemData);
}));

app.use((error, req, res, next) => {
	if (error.response) {
		console.info(`${error.request.method} request to ${error.request.path} resulted in a ${error.response.status}`)
		res.status(200).json({ quest: [], hideout: [], trading: [], crafting: [] });
	} else {
		console.error(error.stack);
		res.status(500).send({ message: 'An error occurred' })
	}
});

app.listen(3001, () =>
	console.log('Express server is running on localhost:3001')
);