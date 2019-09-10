'use strict'

//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=pQ6wyhd76wnAlu3Zt2FcrVAl6a3ahQjSTFGJ8baB

const apiKey = "pQ6wyhd76wnAlu3Zt2FcrVAl6a3ahQjSTFGJ8baB";

const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson, limit) {
    console.log(responseJson)
    $('.api-results').empty();
    for (let i = 0; i < responseJson.data.length; i++) {

        $('.api-results').append(
            `<ul> 
    <li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <p>
            <a href="${responseJson.data[i].directionsUrl}">Directions
            </a>
        </p>
    </li>
     `
        )
    };
};

function getParks(query, limit = 10) {
    const params = {
        q: query,
        api_key: apiKey,
        language: 'en',
        limit
    };

    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;

    console.log(url)

    const options = {
        // mode: 'cors',
        // headers: new Headers({
        //     'Access-Control-Allow-Origin':'*',
        //     "Access-Control-Allow-Headers":"Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",

        //     "X-Api-Key": apiKey})
    };

    $('.api-results').html(`<p>Please wait...</p>`);
    fetch(url, options)
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
        const limit = $('#js-max-results').val();
        const numericLimit = parseInt(limit, 10)
        if (numericLimit <= 0 || numericLimit > 50) {
            return alert('Limit should be a number between 1 and 50')
        }
        getParks(searchTerm, limit);
    });
}

$(watchForm)