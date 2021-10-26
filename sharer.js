const textbox = document.getElementById('textbox');

function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

fetch('http://project2.miguelcodessometimes.me:8443/log')
  .then(assertResponse)
  .then(response => response.text())
  .then(data => textbox.innerText = data)
  .catch(error => textbox.innerText = error);
