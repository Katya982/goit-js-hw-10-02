import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import Notiflix from "notiflix";

const API_KEY = 'live_TZmlc8tMIxgK8jwqfcJ3Zh9DjwLg8Q1333vrukIkxnaInK2qcDvA0P94xz1hr7cl';

axios.defaults.headers.common["x-api-key"] = API_KEY;

const catSelector = document.getElementById('selector');
const catInfo = document.getElementById('catInfo');
const loader = document.getElementById('loader');
const error = document.getElementById('error');

function catSelectorOptions() {
    loader.classList.remove('visually-hidden');
    catSelector.classList.add('visually-hidden');
    error.classList.add('visually-hidden');
    catInfo.classList.add('visually-hidden');

    fetchBreeds()
        .then(data => {

            const options = data.map(({ id, name }) => ` <option value="${id}">${name}</option>`
            ).join(' ');

            catSelector.innerHTML = options;
 
            new SlimSelect({
                select: catSelector,
                
            })
            loader.classList.add('visually-hidden');
            catSelector.classList.remove('visually-hidden');
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
            console.error(error);
        });
}

catSelectorOptions();

function onChangeSelector(e) {
    loader.classList.remove('visually-hidden');
    catInfo.classList.remove('visually-hidden');
    
    const selectedBreedId = e.currentTarget.value;

    fetchCatByBreed(selectedBreedId)
        .then(data => {
            createMarkup(data);
            loader.classList.add('visually-hidden');
            catInfo.classList.remove('visually-hidden');
        })
        .catch(error => {
            clearContent();
            loader.classList.add('visually-hidden');
            Notiflix.Notify.failure('Oops! Something went wrong! Try reloading the page!');
            console.error(error);
        });
}

function clearContent() {
  loader.classList.add('visually-hidden');
  catInfo.classList.add('visually-hidden');
  catInfo.innerHTML = '';
}

catSelector.addEventListener("change", onChangeSelector);

function createMarkup(data) {
    const { breeds, url } = data[0];
    const { name, temperament, description } = breeds[0];
    const breedCard = `
      <img class="cat-img" width = "360px" src="${url}" alt="${name}">
      <div class="descr-wraper">
        <h2 class="cat-breed">${name}</h2>
        <p class="breed-descr">${description}</p>
        <p class="cat-temp">
        <span class="temp-decr">Temperament:</span> ${temperament}
        </p>
      </div>
    `;
    catInfo.innerHTML = breedCard;

}




