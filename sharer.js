const textbox = document.getElementById('textbox');
const service = express();

function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

fetch('https://project2.miguelcodessometimes.me:8443/log')
  .then(assertResponse)
  .then(response => response.text())
  .then(data => textbox.innerText = data)
  .catch(error => textbox.innerText = error);

  service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
  });
