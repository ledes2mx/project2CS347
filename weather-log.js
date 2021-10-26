const express = require('express');
const weatherLogs = {};
const fs = require('fs');
const { request } = require('http');
const service = express();
const json = fs.readFileSync('credentials.json', 'utf8');
const mysql = require('mysql');
const credentials = JSON.parse(json);
service.use(express.json());

const connection = mysql.createConnection(credentials);
connection.connect(error => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
});

function rowToLog(row){
    return {
        day: row.day,
        month: row.month,
        year: row.year,
        weather: row.weather,
    };
}

service.get('/log', (request, response) => {
    const query = 'SELECT * FROM logs';
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
    request.body.hasOwnProperty('weather')) {
        const parameters = [
            request.body.day,
            request.body.month,
            request.body.year,
            request.body.weather,
        ];

        const query = 'INSERT INTO logs(day, month, year, weather) VALUES (?, ?, ?, ?)';
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
        request.body.weather,
        parseInt(request.params.id),
    ];
    const query = 'UPDATE log SET day = ?, month = ?, year = ?, weather = ? WHERE id = ?';

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