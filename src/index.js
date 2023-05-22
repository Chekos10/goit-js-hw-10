import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.getElementById('search-box'),
    list: document.querySelector(".country-list"),
    country_info: document.querySelector(".country-info"),
}
refs.input.addEventListener("input", debounce(onInput,DEBOUNCE_DELAY))

function onInput (event){
    refs.list.innerHTML = ''
    refs.country_info.innerHTML = ''
    const countries = event.target.value.trim()
    fetchCountries(countries)
    .then(result => {
        return result.reduce(
            (markup, element) => getCountries(result, element) + markup,'');
        })
        .then(updateMarkup)
        .catch(error => onError(error));
}

function onError(error){
    if(error.message === "404"){
        return Notify.failure('Oops, there is no country with that name.')
    }else{
        return  Notify.failure(`${error.message}`)
    }
}

function getCountries(result,element){
    const countriesLength = result.length
    if(countriesLength > 10){
        refs.list.innerHTML = ''
        refs.country_info.innerHTML = ''
        return  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    }else if (countriesLength >=2 && countriesLength<=10){
        return countriesCard(element)
    }else{
        return countryCard(element)
    }
}

function countriesCard(element){
    refs.country_info.innerHTML = ''
    return `<li>
    <img src='${element.flags.png}' width ="30px" height="25px" alt='${element.flags.alt}' srcset='${element.flags.svg}'></img>
    <p>${element.name.common}</p>
    </li>`
}
function countryCard(element){
    const languages = Object.values(element.languages).join(', ');
    refs.country_info.innerHTML = ''
    return `
    <div>
    <img src='${element.flags.png}' width="200px" height="150px" alt='${element.flags.alt}' srcset='${element.flags.svg}'></img>
    <h2>${element.name.common}</h2>
    </div>
        <ul>
        <li><b>Capital:</b> ${element.capital}</li>
        <li><b>Population:</b> ${element.population}</li>
        <li><b>Languages:</b> ${languages}</li>
    </ul>`;
}


function updateMarkup(markup){
    markup.includes('country-info-list')
    ? (refs.country_info.innerHTML = markup)
    : (refs.list.innerHTML = markup);
}
