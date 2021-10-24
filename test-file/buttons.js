

const speciesBox = document.getElementById('species-box');
const newButton = document.getElementById('new-button');
const cards = document.getElementById('cards');

function assertResponse(response) {
  if (response.status >= 200 || response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
}

function getAllSpecies() {
  fetch('http://localhost:5000/species')
    .then(assertResponse)
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log(data);
      }
    })
    .catch(error => console.error(error));
}

function addCard(species, count) {
  const button = document.createElement('button');
  button.classList.add('card', 'increment-card');
  button.innerHTML = `<h3>${species}</h3><span>${count}</span>`;
  cards.prepend(button);

  button.addEventListener('click', () => {
    const options = {method: 'PATCH'};
    const encodedSpecies = encodeURIComponent(species);
    fetch(`http://localhost:5000/species/${encodedSpecies}`, options)
      .then(assertResponse)
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          button.children[1].innerText = data.results.count;
        }
      })
      .catch(error => console.error(error));
  });
}

function addSpecies() {
  const options = {method: 'POST'};
  const encodedSpecies = encodeURIComponent(speciesBox.value);
  fetch(`http://localhost:5000/species/${encodedSpecies}`, options)
    .then(assertResponse)
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        speciesBox.value = '';
        addCard(data.results.species, data.results.count);
      }
    })
    .catch(error => console.error(error));
}

newButton.addEventListener('click', addSpecies);
getAllSpecies();