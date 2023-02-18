import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import lodash from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';

const input = document.getElementById('search-box');
const div = document.querySelector('.country-info');
const ul = document.querySelector('.country-list');

const DEBOUNCE_DELAY = 300;

input.addEventListener('input', lodash(inputFetchCountries, DEBOUNCE_DELAY));

function inputFetchCountries(e) {
  e.preventDefault();
  const input = e.target.value.trim();
  console.log(input);
  if (!input) {
    resetData(ul);
    resetData(div);
    return;
  }
  fetchCountries(input)
    .then(ar => {
      console.log(ar[0]);
      if (ar.length > 10) {
        Error(
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          )
        );
      } else if (ar.length >= 2 && ar.length <= 10) {
        resetData(ul);
        createMarkup(ar);
        resetData(div);
      } else {
        resetData(div);
        countryCard(ar);
        resetData(ul);
      }
    })
    .catch(() => {
      resetData(ul);
      resetData(div);
      Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkup(dataCountry) {
  const markup = dataCountry
    .map(({ name, flags }) => {
      return `<li class="country-list-item">
        <img class="country-list-img" src="${flags.svg}" alt="flag" />
        <p class="country-list-text">${name.official}</p>
      </li>`;
    })
    .join('');
  return ul.insertAdjacentHTML('beforeend', markup);
}

function countryCard(dataCountry) {
  const markup = dataCountry
    .map(({ name, capital, population, flags, languages }) => {
      return `
<div class="country-flag">
  <img class="country-img" src="${flags.svg} " alt="flag">
  <p class="country-name">${name.official}</p>
</div>
<ul class="country-info">
    <li class="country-item"> <b>Capital</b>:
  <span class="country-span">${capital}</span>
    </li>
    <li class="country-item"> <b>Population</b>:
  <span class="country-span">${population}</span>
    </li>
    <li class="country-item"> <b>Languages</b>:
  <span class="country-span">${Object.values(languages).join(', ')}</span>
    </li>
</ul>`;
    })
    .join('');
  return div.insertAdjacentHTML('beforeend', markup);
}

function resetData(el) {
  el.innerHTML = '';
}
