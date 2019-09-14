'use strict'

//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=pQ6wyhd76wnAlu3Zt2FcrVAl6a3ahQjSTFGJ8baB

const apiKey = "pQ6wyhd76wnAlu3Zt2FcrVAl6a3ahQjSTFGJ8baB";

const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson)
    $('.api-results').empty();
    for (let i = 0; i < responseJson.data.length; i++) {

        $('.api-results').append(
            `<ul> 
    <li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <p>${responseJson.data[i].latLong}</p>
        <p>
            <a target="_blank" rel="noopener noreferrer" href="${responseJson.data[i].directionsUrl}">URL
            </a>
        </p>
    </li>
     `
        )
    };
};

// function getParks(query, limit = 10, stateCodes = '') {
function getParks(query, limit, stateCodes) {
    const params = {
        q: query,
        api_key: apiKey,
        language: 'en',
        limit,
        stateCode: stateCodes,
    };
    // if (stateCodes) {
    //     params.stateCode = stateCodes
    // }

    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;

    console.log(`FETCH URL is: ${url}`)

    $('.api-results').html(`<p>Please wait...</p>`);
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('.api-results').empty()
            $('.js-error').text(`Something went wrong: ${err.message}`);
        })
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-parkName').val();
        const stateCodes = $('#js-stateCodes').val().split(",");
        const limit = $('#js-max-results').val();
        const numericLimit = parseInt(limit, 10)
        if (numericLimit <= 1 || numericLimit > 50) {
            return alert('Limit should be a number between 1 and 50')
        }
        getParks(searchTerm, limit, stateCodes);
    });
}

$(watchForm)
