import { getData } from "./network.js";
import { API_KEY } from "./utils.js";

// Add a movie to the favorites storage
const addToFavorites = async (movieId) => {
  try {
    const movie = await getData(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    // Avoid duplicates
    if (!favorites.find((fav) => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert(`${movie.title} has been added to your favorites!`);
    } else {
      alert(`${movie.title} is already in your favorites!`);
    }
  } catch (error) {
    console.error("Error adding to favorites: ", error);
  }
};

// Display favorites
const displayFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites;
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

export { addToFavorites, displayFavorites, saveNoteForMovie };
