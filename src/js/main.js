const ul = document.getElementById("items-list");
const apiKey = "0dd562c1903f3f6f6244f87faff5d4c7";
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
const moviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
const movieGenreUrl =
  "https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}";
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";
let genresMap = {};

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

ul.classList.add(
  "grid",
  "lg:grid-cols-5",
  "md:grid-cols-4",
  "md:gap-2",
  "sm:grid-cols-2",
  "max-sm:grid-cols-1",
  "max-sm:place-items-center"
);

const fetchGenres = async () => {
  try {
    const response = await fetch(genresUrl);
    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
    const data = await response.json();
    data.genres.forEach((genre) => {
      genresMap[genre.id] = genre.name;
    });
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
};

const fetchMovies = async () => {
  try {
    await fetchGenres();
    const response = await fetch(moviesUrl);
    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.status}`);
    }
    const data = await response.json();

    data.results.forEach((movie) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      const h2 = document.createElement("h2");
      const genresContainer = document.createElement("p");
      h2.textContent = truncateText(movie.title, 15);
      const genreName = movie.genre_ids.map((id) => genresMap[id]).join(",");
      const truncatedGenres = truncateText(genreName, 15);
      genresContainer.textContent = `Genres: ${truncatedGenres}`;
      if (movie.poster_path) {
        img.src = `${imageBaseUrl}${movie.poster_path}`;
        img.alt = movie.title;
      } else {
        img.src = "https://via.placeholder.com/150"; // Placeholder if no image is available
        img.alt = "No image available";
      }
      img.classList.add(
        "sm:h-[400px]",
        "md:h-[300px]",
        "lg:h-[350]",
        "xl:h-[450px]"
      );

      // Added Favorite button
      const button = document.createElement("button");
      button.textContent = "Add to Favorites";
      button.className = "mb-8 bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded";
      button.setAttribute("onclick", `addToFavorites(${movie.id})`);

      h2.classList.add("text-xl", "text-white", "mb-1", "font-semibold");
      genresContainer.classList.add("text-md", "text-white", "mb-2");
      li.appendChild(img);
      li.appendChild(h2);
      li.appendChild(genresContainer);
      li.appendChild(button);
      ul.appendChild(li);
    });
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
};

fetchMovies();

// Search bar  feature

const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`;

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("submit-btn");
const searchResults = document.getElementById("search-results");

const DISPLAY_LIMIT = 20;
const OVERVIEW_LIMIT = 50;

const limitText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const fetchSearch = async (input) => {
  try {
    const response = await fetch(
      `${searchUrl}&language=en-US&page=1&include_adult=false&query=${input}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search input");
    }
    const data = await response.json();

    const results = data.results;
    console.log("data", results);
    

    displaySearchResults(results);

    // clear input
    searchInput.value = "";
  } catch (e) {
    console.error("Error fetching results", e);
  }
};

const displaySearchResults = (list) => {
  if (list.length == 0) {
    searchResults.innerHTML = `<p class="text-red-600 mx-auto text-md mb-2">No information to display</p>`
    console.log("No data");
  } else {
    searchResults.classList.add(
      "grid",
      "lg:grid-cols-5",
      "md:grid-cols-4",
      "md:gap-2",
      "sm:grid-cols-2",
      "max-sm:grid-cols-1",
      "max-sm:place-items-center"
    );
    const displayLimit = Math.min(list.length, DISPLAY_LIMIT);

    for (let i = 0; i < displayLimit; ++i) {

      const li = document.createElement("li");
      const img = document.createElement("img");
      const h2 = document.createElement("h2");

      const p = document.createElement("p");
      p.textContent = `${limitText(list[i].overview, OVERVIEW_LIMIT)}`;

      const button = document.createElement("button");
      button.textContent = "Add to Favorites";

      h2.textContent = limitText(list[i].title, DISPLAY_LIMIT);

      if (list[i].poster_path) {
        img.src = `${imageBaseUrl}${list[i].poster_path}`;
        img.alt = list[i].title;
      } else {
        img.src = "https://placehold.co/600x900/png"; // Placeholder if no image is available
        img.alt = "No image available";
        img.classList.add("w-64");
      }

      h2.classList.add("text-xl", "text-white",  "m-2", "font-semibold");

      p.classList.add("text-md", "text-white", "mb-2")
      button.className = "mb-8 bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded";
      button.setAttribute("onclick", `addToFavorites(${list[i].id})`);

      li.appendChild(img);
      li.appendChild(h2);
      li.appendChild(p);
      li.appendChild(button)

      searchResults.appendChild(li);
    }
  }
};

searchButton.addEventListener("click", () => fetchSearch(searchInput.value.trim()));
// Clear search results
searchInput.addEventListener("click", () => (searchResults.textContent = ""));
// END Search

// Function to add a movie to favorites (stored in localStorage)
function addToFavorites(movieId) {
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
      .then((response) => response.json())
      .then((movie) => {
          let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          // Avoid duplicates
          if (!favorites.find((fav) => fav.id === movie.id)) {
              favorites.push(movie);
              localStorage.setItem("favorites", JSON.stringify(favorites));
              alert(`${movie.title} has been added to your favorites!`);
          } else {
              alert(`${movie.title} is already in your favorites!`);
          }
      })
      .catch((error) => console.error("Error adding to favorites: ", error));
}

// Hamburger menu toggle 
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');


mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});