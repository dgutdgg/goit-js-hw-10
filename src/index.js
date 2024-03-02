import axios from 'axios';
import { fetchCatByBreed } from './cat-api';

axios.defaults.headers.common['x-api-key'] =
  'live_7nRnrE7mFd9wP9eUEAPEl1jAMACYW2BIwFvWJMYHozlN7uTxQp6SxDtIJ3LAPoTn';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

document.addEventListener('DOMContentLoaded', () => {
  function fetchBreeds() {
    //toggleError(false);
    return axios
      .get('https://api.thecatapi.com/v1/breeds')
      .then(response => {
        return response.data.map(breed => ({
          id: breed.id,
          name: breed.name,
        }));
      })
      .catch(error => {
        toggleLoader(false);
        //toggleError(true);
      });
  }
  function toggleLoader(show) {
    if (show) {
      loader.style.display = 'block';
    } else {
      loader.style.display = 'none';
    }
  }

  function toggleError(show) {
    if (show) {
      error.style.display = 'block';
    } else {
      error.style.display = 'none';
    }
  }

  function showError() {
    alert('Oops! Something went wrong! Try reloading the page!');
  }

  function toggleBreedSelect(show) {
    if (show) {
      breedSelect.style.display = 'block';
    } else {
      breedSelect.style.display = 'none';
    }
  }

  function toggleCatInfo(show) {
    if (show) {
      catInfo.style.display = 'block';
    } else {
      catInfo.style.display = 'none';
    }
  }

  toggleLoader(true);
  toggleBreedSelect(false);
  toggleCatInfo(false);
  toggleError(false);
  fetchBreeds()
    .then(breeds => {
      toggleLoader(false);
      toggleBreedSelect(true);
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });
    })
    .catch(err => {
      showError();
      //toggleError(true);
    });

  breedSelect.addEventListener('change', event => {
    const selectedBreedId = event.target.value;
    catInfo.innerHTML = '';
    toggleLoader(true);
    //toggleError(false);

    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        toggleLoader(false);
        toggleCatInfo(true);
        const catImage = document.createElement('img');
        catImage.src = catData.url;

        if (catData.breeds && catData.breeds.length > 0) {
          const breedName = document.createElement('h3');
          breedName.textContent = `Breed: ${catData.breeds[0].name}`;

          const description = document.createElement('p');
          description.textContent = `Description: ${catData.breeds[0].description}`;

          const temperament = document.createElement('p');
          temperament.textContent = `Temperament: ${catData.breeds[0].temperament}`;

          catInfo.appendChild(catImage);
          catInfo.appendChild(breedName);
          catInfo.appendChild(description);
          catInfo.appendChild(temperament);
        } else {
          console.error('No breeds data found in catData:', catData); // Dodaj ten wiersz
        }
      })
      .catch(err => {
        toggleLoader(false);
        showError();
        //toggleError(true);
      })
      .finally(() => {
        toggleLoader(false);
      });
  });
});
