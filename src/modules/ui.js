import { addToFavorites, saveNoteForMovie } from "./storage.js";
import { getData } from "./network.js";
import {
  IMAGE_BASE_URL,
  SEARCH_URL,
  GENRES_URL,
  DISPLAY_LIMIT,
  truncateText,
} from "./utils.js";

const searchResults = document.getElementById("search-results");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("submit-btn");

const createElement = (type, styles, content) => {
  const elt = document.createElement(type);
  elt.className = styles;
  elt.textContent = content;

  return elt;
};

const createMovieCard = (movie, genresMap) => {
  const div = createElement("div", "", "");
  div.id = movie.id;

  const img = createElement(
    "img",
    "sm:h-[400px] md:h-[300px] lg:h-[350] xl:h-[450px]",
    ""
  );
  img.src = movie.title
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://placehold.co/600x900/png";

  img.alt = movie.title;

  const h2 = createElement(
    "h2",
    "text-xl text-white mb-1 font-semibold",
    `${truncateText(movie.title, DISPLAY_LIMIT)}`
  );

  const genreName = movie.genre_ids.map((id) => genresMap[id]).join(",");
  const truncatedGenres = truncateText(genreName, DISPLAY_LIMIT);
  const genresContainer = createElement(
    "p",
    "text-md text-white mb-2",
    `Genres: ${truncatedGenres}`
  );

  // Added Favorite button
  const button = createElement(
    "button",
    "mb-8 bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded",
    "Add to Favorites"
  );
  button.addEventListener("click", () => addToFavorites(movie.id), false);

  div.appendChild(img);
  div.appendChild(h2);
  div.appendChild(genresContainer);
  div.appendChild(button);

  return div;
};

const createFavoriteCard = (movie) => {
  const div = createElement("div", "", "");
  div.id = movie.id;

  const img = createElement(
    "img",
    "sm:h-[400px] md:h-[300px] lg:h-[350] xl:h-[450px]",
    ""
  );
  img.src = movie.title
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : "https://placehold.co/600x900/png";

  img.alt = movie.title;

  const h2 = createElement(
    "h2",
    "text-xl text-white m-2 font-semibold",
    `${truncateText(movie.title, DISPLAY_LIMIT)}`
  );

  const p = createElement(
    "p",
    "text-md text-white mb-2",
    `${truncateText(movie.overview, DISPLAY_LIMIT)}`
  );

  const noteSection = createElement("div", "note-section mt-2 sm:mr-4", "");

  const textarea = createElement(
    "textarea",
    "w-full p-2 border rounded max-sm:w-5/6",
    ""
  );
  textarea.id = `note-${movie.id}`;
  textarea.placeholder = "Write a note...";

  const button = createElement(
    "button",
    "bg-blue-500 text-white mt-2 px-4 py-2 rounded hover:bg-blue-600 max-sm:w-5/6 max-sm:mb-4 sm:mb-4 sm:w-full",
    "Save Note"
  );

  button.addEventListener("click", () => saveNoteForMovie(movie.id));

  noteSection.appendChild(textarea);
  noteSection.appendChild(button);

  div.appendChild(img);
  div.appendChild(h2);
  div.appendChild(p);
  div.appendChild(noteSection);

  return div;
};

const displaySearchResults = async (input) => {
  try {
    const genresMap = {};
    const moviesGenres = await getData(GENRES_URL);
    moviesGenres.genres.forEach((genre) => {
      genresMap[genre.id] = genre.name;
    });

    const movies = await getData(
      `${SEARCH_URL}&language=en-US&page=1&include_adult=false&query=${input}`
    );
    console.log(movies);
    if (movies.results.length == 0) {
      searchResults.innerHTML = `<p class="text-red-600 mx-auto text-md mb-2">No information to display</p>`;
      console.log("No data");
    } else {
      movies.results.forEach((movie) => {
        const movieCard = createMovieCard(movie, genresMap);
        searchResults.appendChild(movieCard);
      });
      const hr = createElement(
        "hr",
        "h-px my-8 bg-gray-300 border-0 dark:bg-gray-700",
        ""
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export {
  searchButton,
  searchResults,
  searchInput,
  createElement,
  createMovieCard,
  createFavoriteCard,
  displaySearchResults,
};
