"use strict";
// import all components and functions
import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { search } from "./search.js";
import { createMovieCard } from "./movie-card.js"

const pageContent = document.querySelector("[page-content]");

sidebar();

// Home page section (top rate, upcoming, trending movie)
const homePageSections = [
    {
        title: "Upcoming Movies",
        path: "/movie/upcoming",
    },
    {
        title: "Today\'s Trending Movies",
        path: "/trending/movie/week",
    },
    {
        title: "Top Movies",
        path: "/movie/top_rated",
    },
];
// fetch all genre eg {id: 123, name: action}
// then change genre formate eg: {123: "action"}
const genreList = {
    // insert genre string from genre_id and name here: [23,32] => "action"
    asString(genreIdList) {
        let newGenreList = [];

        for (const genreId of genreIdList) {
            // gán this == genre list
            this[genreId] && newGenreList.push(this[genreId]);
        }
        return newGenreList.join(", ");
    },
};

fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function ({ genres }) {
        for (const { id, name } of genres) {
            genreList[id] = name;
        }
        // fetch data from the server
        fetchDataFromServer(
            `https://api.themoviedb.org/3/movie/popular?page=1'&api_key=${api_key}`,
            heroBanner
        );
    }
);

const heroBanner = function ({ results: movieList }) {
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Popular Movie";

    banner.innerHTML = `
        <div class="banner-slider"></div>

        <div class="slider-control">
            <div class="control-inner"></div>
        </div>
    `;

    let controlItemIndex = 0;

    for (const [index, movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id,
        } = movie;

        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item", "");

        sliderItem.innerHTML = `
            <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${index === 0 ? "eager" : "lazy" }>

            <div class="banner-content">
                <h2 class="heading">${title}</h2>

                <div class="meta-list">
                    <div class="meta-item">${release_date.split("-")[0]}</div>
                    <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
                </div>

                <p class="genre">${genreList.asString(genre_ids)}</p>
                <p class="banner-text">${overview}</p>
                <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
                    <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
                    <span class="span">Watch Now</span>
                </a>
            </div>
        `;

        banner.querySelector(".banner-slider").appendChild(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlItemIndex}`);

        controlItemIndex++;

        controlItem.innerHTML = `
            <img src="${imageBaseURL}w154${poster_path}"  alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
        `;

        banner.querySelector(".control-inner").appendChild(controlItem);
    }

    pageContent.appendChild(banner);

    addHeroSlide();

    // fetch data for home section
    for (const { title, path } of homePageSections) {
        fetchDataFromServer(
            `https://api.themoviedb.org/3${path}?page=1'&api_key=${api_key}`,
            createMovieList,
            title
        );
    }
};
// function addHeroSlide
const addHeroSlide = function () {
    const sliderItem = document.querySelectorAll("[slider-item]");
    const sliderControls = document.querySelectorAll("[slider-control]");

    let lastSliderItem = sliderItem[0];
    let lastSliderControl = sliderControls[0];

    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    const sliderStart = function () {
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");

        //  this = slider - control
        sliderItem[Number(this.getAttribute("slider-control"))].classList.add(
            "active"
        );
        this.classList.add("active");

        lastSliderItem = sliderItem[Number(this.getAttribute("slider-control"))];
        lastSliderControl = this;
    };

    addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = `${title}`;

    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">${title}</h3>
        </div>

        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    `;

    for (const movie of movieList) {
        // call from component
        const movieCard = createMovieCard(movie);

        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }
    pageContent.appendChild(movieListElem);
};

search();