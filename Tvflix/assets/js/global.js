'use strict';

// add event on mutiple elements
const addEventOnElements = function(elements, eventType, callback) {
    for (const elem of elements){
        elem.addEventListener(eventType, callback);
    } 
}

// toggle search box in mobile, small browsers

const searchBox = document.querySelector("[search-box]");
const searchToggles = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchToggles, "click", function() {
    searchBox.classList.toggle("active");
})

// lấy Store movieId trong localStorage khi click vào nhiều movie trên card

const getMovieDetail = function(movieId) {
    window.localStorage.setItem("movieId", String(movieId));
}

const getMovieList = function(ulrParam, genreName) {
    window.localStorage.setItem("ulrParam", ulrParam);
    window.localStorage.setItem("genreName", genreName);
}