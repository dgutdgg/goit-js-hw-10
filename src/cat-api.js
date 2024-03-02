import axios from 'axios';

export function fetchCatByBreed(breedId) {
  return axios
    .get('https://api.thecatapi.com/v1/images/search?breed_ids=' + breedId)
    .then(response => {
      return response.data[0];
    });
}
