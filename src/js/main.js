import { getData } from "../modules/network.js";
import {
  searchButton,
  searchInput,
  searchResults,
  createMovieCard,
  displaySearchResults,
} from "../modules/ui.js";
import { GENRES_URL, MOVIES_URL } from "../modules/utils.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const movieContainer = document.getElementById("movie-container");

    const genresMap = {};
    const moviesGenres = await getData(GENRES_URL);
    moviesGenres.genres.forEach((genre) => {
      genresMap[genre.id] = genre.name;
    });

    const movies = await getData(MOVIES_URL);
    console.log(movies);

    movies.results.forEach((movie) => {
      const movieCard = createMovieCard(movie, genresMap);
      movieContainer.appendChild(movieCard);
    });
  } catch (error) {
    console.error(error);
  }
});

searchButton.addEventListener("click", () =>
  displaySearchResults(searchInput.value.trim())
);
// Clear search results
searchInput.addEventListener("click", () => {
  searchResults.textContent = "";
  // clear input
  searchInput.value = "";
});

// Hamburger menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
