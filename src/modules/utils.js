const API_KEY = "0dd562c1903f3f6f6244f87faff5d4c7";
const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
const MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w300";

const DISPLAY_LIMIT = 20;
const OVERVIEW_LIMIT = 50;

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export {
  API_KEY,
  GENRES_URL,
  MOVIES_URL,
  IMAGE_BASE_URL,
  SEARCH_URL,
  DISPLAY_LIMIT,
  OVERVIEW_LIMIT,
  truncateText,
};
