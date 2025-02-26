const localResults = document.getElementById("local-results");
const imageBaseUrl = "https://image.tmdb.org/t/p/w300";
const apiKey = "0dd562c1903f3f6f6244f87faff5d4c7";

const limitText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const OVERVIEW_LIMIT = 50;
const DISPLAY_LIMIT = 20;

const displayFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length == 0) {
    localResults.innerHTML = `<p class="text-red-600 mx-auto text-md mb-2">No information to display</p>`;
  } else {
    localResults.classList.add(
      "grid",
      "lg:grid-cols-5",
      "md:grid-cols-4",
      "md:gap-2",
      "sm:grid-cols-2",
      "max-sm:grid-cols-1",
      "max-sm:place-items-center"
    );

    favorites.forEach((elt) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      const h2 = document.createElement("h2");

      const p = document.createElement("p");
      p.textContent = `${limitText(elt.overview, OVERVIEW_LIMIT)}`;

      h2.textContent = limitText(elt.title, DISPLAY_LIMIT);

      if (elt.poster_path) {
        img.src = `${imageBaseUrl}${elt.poster_path}`;
        img.alt = elt.title;
      } else {
        img.src = "https://placehold.co/600x900/png"; // Placeholder if no image is available
        img.alt = "No image available";
        img.classList.add("w-64");
      }

      h2.classList.add("text-xl", "text-white", "m-2", "font-semibold");

      p.classList.add("text-md", "text-white", "mb-2");
      const noteSection = document.createElement("div");
      noteSection.classList.add("note-section", "mt-2", "sm:mr-4");

      const textarea = document.createElement("textarea");
      textarea.id = `note-${elt.id}`;
      textarea.placeholder = "Write a note...";
      textarea.classList.add(
        "w-full",
        "p-2",
        "border",
        "rounded",
        "max-sm:w-5/6"
      );
      const button = document.createElement("button");
      button.textContent = "Save Note";
      button.classList.add(
        "bg-blue-500",
        "text-white",
        "mt-2",
        "px-4",
        "py-2",
        "rounded",
        "hover:bg-blue-600",
        "max-sm:w-5/6",
        "max-sm:mb-4",
        "sm:mb-4",
        "sm:w-full"
      );
      button.onclick = () => saveNoteForMovie(elt.id);

      noteSection.appendChild(textarea);
      noteSection.appendChild(button);

      li.appendChild(img);
      li.appendChild(h2);
      li.appendChild(p);
      li.appendChild(noteSection);
      localResults.appendChild(li);
    });
  }
};

displayFavorites();

// Search bar  feature

const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`;

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("submit-btn");
const searchResults = document.getElementById("search-results");

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

      h2.classList.add("text-xl", "text-white", "m-2", "font-semibold");

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


const displayNotes = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    localResults.innerHTML = `<p class="text-red-600 mx-auto text-md mb-2">No information to display</p>`;
  } else {
    favorites.forEach((movie) => {
      const movieItem = document.getElementById(`movie-${movie.id}`);
    });
  }
};

function saveNoteForMovie(movieId) {
  const noteInput = document.getElementById(`note-${movieId}`);
  if (!noteInput) {
    console.error("Textarea not found");
    return;
  }

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  console.log("Current favorites:", favorites);

  let movieIndex = favorites.findIndex((m) => m.id === movieId);

  if (movieIndex !== -1) {
    console.log("Saving note:", noteInput.value);
    if (!favorites[movieIndex].note) {
      favorites[movieIndex].note = "";
    }

    favorites[movieIndex].note = noteInput.value;
    localStorage.setItem("favorites", JSON.stringify(favorites));

    alert("✅ Note saved successfully!");
    console.log("Updated favorites:", favorites);
  } else {
    console.error("Movie not found in favorites");
  }
}

// Hamburger menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
