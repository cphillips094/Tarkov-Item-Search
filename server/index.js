const express = require('express');

const app = express();

const baseURL = "escapefromtarkov.gamepedia.com";

app.get('/api/greeting', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    makeRequest('Folder_with_intelligence', (statusCode, result) => {
        // I could work with the resulting HTML/JSON here. I could also just return it
        console.log(`onResult: (${statusCode})\n\n${result}`);
        res.statusCode = statusCode;
      
        res.send(result);
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

app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);