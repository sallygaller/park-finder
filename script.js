"use strict";

const apiKey = 'kyQX9mcSmK6FIdL1ORU1zLwfC2q11Vz9caoqhBar';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParems(parems) {
  let queryString = "";
  for (let i = 0; i < parems.stateCode.length; i++){
    if (i + 1 < parems.stateCode.length){
      queryString += `stateCode=${parems.stateCode[i]}&`
    }
    else {
      queryString += `stateCode=${parems.stateCode[i]}`}
  }
  console.log(queryString)
  const queryItems = `${queryString}&limit=${parems.limit}&api_key=${parems.api_key}`
  console.log(queryItems)
  return queryItems;
}


function displayResults(responseJson) {
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++) {
    $('#results-list').append(
    `<li><h3>${responseJson.data[i].fullName}</h3>
    <p>${responseJson.data[i].description}</p>
    <p>Visit the website <a href="${responseJson.data[i].url}" target="_blank">here</a>.</p>
    <p>${responseJson.data[i].addresses[0].type} Address:<br>
    ${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].line2} ${responseJson.data[i].addresses[0].line3}<br>
    ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}
    <p>
    </li>`
    )}
  $('#results').removeClass('hidden');
};

function getNationalParks(searchState, searchLimit) {
  const parems = {
    stateCode: searchState,
    limit: searchLimit,
    api_key: apiKey,
  }
  console.log(parems);
  const queryString = formatQueryParems(parems);
  const url = searchURL + '?' + queryString;
  console.log(url);
  
  fetch(url)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => displayResults(responseJson))
  .catch(err => {
    $('#js-error-message').text(`Error: ${err.message}`)
  });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    // console.log("form submit!")
    const search = $('#js-search-state').val();
    const searchLimit = $('#js-limit').val();
    const removeSpace = search.replace(/[\s,]+/g, ',');
    const searchState = removeSpace.split(',');
    getNationalParks(searchState, searchLimit)
  });
}

$(watchForm);