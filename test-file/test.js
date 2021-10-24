const express = require('express');

const speciesCounts = {};
const service = express();

service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
  });

// TODO: Add endpoints.
service.get('/species', (request, response) => {
    response.json({
      ok: true,
      results: speciesCounts,
    });
  });

service.get('/species/:name', (request, response) => {
    response.json({
        ok: true,
        results: {
            species: request.params.name,
            count: speciesCounts[request.params.name] ?? 0,
        },
    });
});

service.post('/species/:name', (request, response) => {
    const name = request.params.name;
    if (speciesCounts.hasOwnProperty(name)) {
      response.status(400);
      response.json({
        ok: false,
        results: `Species already exists: ${name}`,
      });
    } else {
      speciesCounts[name] = 1;
      response.json({
        ok: true,
        results: {
          species: name,
          count: speciesCounts[name],
        },
      });
    }
  });

  service.patch('/species/:name', (request, response) => {
    const name = request.params.name;
    if (speciesCounts.hasOwnProperty(name)) {
      speciesCounts[name] += 1;
      response.json({
        ok: true,
        results: {
          species: name,
          count: speciesCounts[name],
        },
      });
    } else {
      response.status(404);
      response.json({
        ok: false,
        results: `No such species: ${name}`,
      });
    }
  });

  service.delete('/species/:name', (request, response) => {
    const name = request.params.name;
    if (speciesCounts.hasOwnProperty(name)) {
      delete speciesCounts[name];
      response.json({
        ok: true,
      });
    } else {
      response.status(404);
      response.json({
        ok: false,
        results: `No such species: ${name}`,
      });
    }
  });

  service.patch('/species', (request, response) => {
    Object.assign(speciesCounts, request.body);
    response.json({
      ok: true,
    });
  });

  function decodeJsonBody(request, response, next) {
    if (request.hasJsonBody) {
      request.body = JSON.parse(request.bodyString);
    }
    next();
  }

const port = 5000;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});