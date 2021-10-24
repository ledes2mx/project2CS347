const fs = require('fs');
const mysql = require('mysql');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

// TODO: issue queries.
const selectQuery = 'SELECT * FROM memory';
connection.query(selectQuery, (error, rows) => {
  if (error) {
    console.error(error);
  } else {
    console.log(rows);
  }
});

const insertQuery = 'INSERT INTO memory(year, month, day, entry) VALUES (?, ?, ?, ?)';
const parameters = [2019, 3, 19, 'I was born.'];
connection.query(insertQuery, parameters, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});

connection.end();