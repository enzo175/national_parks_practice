'use strict'

//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=pQ6wyhd76wnAlu3Zt2FcrVAl6a3ahQjSTFGJ8baB

const apiKey = "pQ6wyhd76wnAlu3Zt2FcrVAl6a3ahQjSTFGJ8baB";

const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) { 
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson, limit){
    console.log(responseJson)
    $('.api_results').empty();
    for (let i = 0; i < responseJson.parks.length & limit; i++){
    $('.api_results').append(
    `<ul> 
    <li><h3>${responseJson.data[i].fullName}</h3>
     <p>${responseJson.data[i].description}</p>
     <p><a href="${responseJson.data[i].directionsUrl}"></p></li>
     `
    )};
};

function getParks(query, limit=10){
    const params = {
        q: query,
        language: 'en',
        limit
    };

  const queryString = formatQueryParams(params)
  const url = searchUrl + '?' + queryString;

  console.log(url)

  const options = {
    headers: new Headers({
        "X-Api-Key": apiKey})
    };

  fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
        $('.js-error').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-parkName').val();
        const limit = $('#js-max-results').val();
        getParks(searchTerm, limit);
    });
}

$(watchForm)