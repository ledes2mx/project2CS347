const express = require('express');
const weatherLogs = {};
const fs = require('fs');
const service = express();
const json = fs.readFileSync('credentials.json', 'utf8');
const mysql = require('mysql');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);
connection.connect(error => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
});

service.get('/log', (request, response) => {
    response.json({
        ok: true,
        results: weatherLogs,
    });
});

service.get('/log/:day', (request, response) => {
    response.json({
        ok: true,
        results: {
            log: request.params.day,
        },
    });
});

service.post('log/:day', (request, response) => {
    const day = request.params.day;
    if (weatherLogs.hasOwnProperty(day)) {
        response.status(400);
        response.json({
            ok: false,
            results: 'Oops! This day is logged already',
        });
    }
    else {
        weatherLogs[day] = 1;
        response.json({
            ok: true,
            results: {
                log: day,
                count: weatherLogs[request.params.day],
            },
        });
    }
});

service.post('log/:day/:temp/:weather', (request, response) => {
    const day = request.params.day;
    const temp = request.params.temp;
    const weather = request.params.weather;
    if (weatherLogs.hasOwnProperty(day)) {
        response.status(400);
        response.json({
            ok: false,
            results: 'Oops! This day is logged already',
        });
    }
    else {
        weatherLogs[day] = 1;
        response.json({
            ok: true,
            results: {
                log: day,
                count: weatherLogs[request.params.day],
                temp: temp,
                weather: weather,
            },
        });
    }
});

service.patch('log/:day/:temp/:weather', (request, response) => {
    const day = request.params.day;
    const temp = request.params.temp;
    const weather = request.params.weather;
    if (weatherLogs.hasOwnProperty(day)) {
        weatherLogs[day] = 1;
        response.json({
            ok: true,
            results: {
                log: day,
                count: weatherLogs[request.params.day],
                temp: temp,
                weather: weather,
            },
        });
    }
    else {
        response.status(400);
        response.json({
            ok: false,
            results: 'Oops! This day is logged already',
        });
    }
});

service.patch('log/:day', (request, response) => {
    const day = request.params.day;
    if (weatherLogs.hasOwnProperty(day)) {
        delete weatherLogs[day];
        response.json({
            ok: true,
        });
    }
    else {
        response.status(404);
        response.json({
            ok: false,
            results: 'There is no record of this day',
        });
    }
});

const port = 8443;
service.listen(port, () => {
    console.log('I am alive on port ${port}!');
});