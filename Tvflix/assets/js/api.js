'use strict';

const api_key = 'b2ec7a2ead2baa8e7e479beeefc9f09b';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

// fetch data from a server using the'url' and password
// Kết quả trên file Json gọi đến "callback"

const fetchDataFromServer = function(url, callback, optionalParam) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data, optionalParam));
} 

export {
    imageBaseURL, api_key, fetchDataFromServer
}