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
  //   console.log(newsApiService.query);

  if (!newsApiService.query.length) return;

  newsApiService
    .fetchArticles()
    .then(countriesArray => {
      //   console.log('length ===> ', countriesArray.length);

      if (countriesArray.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      } else if (countriesArray.length >= 2 && countriesArray.length <= 10) {
        refs.countryListEl.insertAdjacentHTML(
          'beforeend',
          oneCountry(countriesArray)
        );
      } else {
        refs.countryInfoEl.insertAdjacentHTML(
          'beforeend',
          countryMarkup(countriesArray)
        );
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
function countryMarkup(countries) {
  return countries
    .map(element => {
      return `<div class='one-country'>
        <img width="60px" height="60px" src='${element.flags.svg}' alt='${
        element.name.common
      } flag' />
        <p class="country-name">${element.name.official}</p></div>
        <p class="additional-info"><span class= "country">Capital:</span> ${
          element.capital
        }</p>
        <p class="additional-info"><span class= "country">Population:</span> ${
          element.population
        }</p>
        <p class="additional-info"><span class= "country">Languages:</span> ${Object.values(
          element.languages
        )}</p>`;
    })
    .join('');
}
function oneCountry(countries) {
  return countries
    .map(element => {
      return `<li class="multiple-countries">
      <img width="60px" height="60px" src="${element.flags.svg}" alt="${element.name.common} flag" />
      <p class="country-name">${element.name.common}</p></li>`;
    })
    .join('');
}
