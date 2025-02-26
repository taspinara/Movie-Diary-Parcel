import { displayFavorites } from "../modules/storage.js";
import {
  createFavoriteCard,
  displaySearchResults,
  searchButton,
  searchInput,
  searchResults,
} from "../modules/ui.js";

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const favoritesContainer = document.getElementById("local-results");
    const favorites = displayFavorites();

    if (favorites.length == 0) {
      favoritesContainer.innerHTML = `<p class="text-red-600 mx-auto text-md mb-2">No information to display</p>`;
    } else {
      favorites.forEach((movie) => {
        const movieCard = createFavoriteCard(movie);
        favoritesContainer.appendChild(movieCard);
      });
    }
  } catch (error) {}
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
