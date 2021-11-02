const express = require('express');
const weatherLogs = {};
const fs = require('fs');
const { request } = require('https');
const service = express();
const json = fs.readFileSync('credentials.json', 'utf8');
const mysql = require('mysql');
const credentials = JSON.parse(json);


service.use(express.json());

service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
});

service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
  });

const connection = mysql.createConnection(credentials);
connection.connect(error => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
});

function rowToLog(row){
    return {
        id: row.id,
        day: row.day,
        month: row.month,
        year: row.year,
        temp: row.temp,
        weather: row.weather,
    };
}

service.get('/report.html', (request, response) => {
    response.sendFile('report.html', {root: "report"});
});

service.get('/log', (request, response) => {
    const query = 'SELECT * FROM logs WHERE is_deleted = 0';
    connection.query(query, (error, rows) => {
        if (error) {
            response.status(500);
            response.json ({
                ok: false,
                results: error.message,
            });
        }
        else {
            const log = rows.map(rowToLog);
            response.json ({
                ok: true,
                results: rows.map(rowToLog)
            });
        }
    });
});


service.get('/log/:day/:month/:year', (request, response) => {
    const parameters = [
        parseInt(request.params.day),
        parseInt(request.params.month),
        parseInt(request.params.year),
    ];
    const query = 'SELECT * FROM logs WHERE day = ? AND month = ? AND year = ? AND is_deleted = 0 ORDER BY year DESC';

    connection.query(query, parameters, (error, rows) => {
        if (error) {
            response.status(500);
            response.json({
                ok: false,
                results: error.message,
            });
        }
        else {
            const log = rows.map(rowToLog);
            response.json({
                ok: true,
                results: rows.map(rowToLog),
            });
        }
    });
});


service.post('/log', (request, response) => {
    if (request.body.hasOwnProperty('day') &&
    request.body.hasOwnProperty('month') &&
    request.body.hasOwnProperty('year') &&
    request.body.hasOwnProperty('temp') &&
    request.body.hasOwnProperty('weather')) {
        const parameters = [
            request.body.day,
            request.body.month,
            request.body.year,
            request.body.temp,
            request.body.weather,
        ];

        const query = 'INSERT INTO logs(day, month, year, temp, weather) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, parameters, (error, result) => {
            if (error) {
                response.status(500);
                response.json({
                    ok: false,
                    results: error.message,
                });
            }
            else {
                response.json({
                    ok: true,
                    results: result.insertID,
                });
            }
        });
    }
    else {
        response.status(400);
        response.json({
            ok: false,
            results: 'Weather log is not completely filled out with either the day, month, year, or weather description',
        });
    }
});

service.patch('/log/:id', (request, response) => {
    const parameters = [
        request.body.day,
        request.body.month,
        request.body.year,
        request.body.temp,
        request.body.weather,
        parseInt(request.params.id),
    ];
    const query = 'UPDATE logs SET day = ?, month = "?", year = ?, temp = ?, weather = "?" WHERE id = ?';

    connection.query(query, parameters, (error, result) => {
        if (error) {
            response.status(404);
            response.json({
                ok: false,
                results: error.message,
            });
        }
        else {
            response.json({
                ok: true,
            });
        }
    });
});

service.delete('/log/:id', (request, response) => {
    const parameters = [parseInt(request.params.id)];
    const query = 'UPDATE logs SET is_deleted = 1 WHERE id = ?';

    connection.query(query, parameters, (error, result) => {
        if (error) {
            response.status(404);
            response.json({
                ok: false,
                results: error.message,
            });
        }
        else {
            response.json({
                ok: true,
            });
        }
    });
});

const port = 8443;
service.listen(port, () => {
    console.log('I am alive on port ${port}!');
});