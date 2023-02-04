import './css/styles.css';

import { debounce } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputElem = document.getElementById('search-box');
const listElem = document.querySelector('.country-list');
const infoElem = document.querySelector('.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(listElem);
    cleanMarkup(infoElem);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(listElem);
      cleanMarkup(infoElem);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(listElem);
    const markupInfo = createInfoMarkup(data);
    infoElem.innerHTML = markupInfo;
  } else {
    cleanMarkup(infoElem);
    const markupList = createListMarkup(data);
    listElem.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40"> ${name.official}</li>`,
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" > ${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

inputElem.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));