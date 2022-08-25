import './css/styles.css';
import NewsApiService from './fetchCountries.js';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBoxEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

const newsApiService = new NewsApiService();

refs.searchBoxEl.addEventListener(
  'input',
  debounce(onInputSearch, DEBOUNCE_DELAY)
);

function onInputSearch(e) {
  e.preventDefault();
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';

  newsApiService.query = e.target.value.trim();
  console.log(newsApiService.query);

  if (newsApiService.query.length) {
    newsApiService
      .fetchArticles()
      .then(countriesArray => {
        console.log(countriesArray);
        if (countriesArray.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
          return;
        } else if (countriesArray.length < 10 && countriesArray.length >= 2) {
          refs.countryListEl.insertAdjacentHTML(
            'beforeend',
            oneCountry(countriesArray)
          );
        } else {
          refs.countryInfoEl.insertAdjacentHTML(
            'beforeend',
            countryMarkup(countriesArray)
          );
          console.log(refs.countryInfoEl);
        }
      })
      .catch(err => {
        console.log(err);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}
