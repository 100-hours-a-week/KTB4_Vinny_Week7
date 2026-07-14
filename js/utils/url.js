export function getMovieIdFromUrl() {
  return new URLSearchParams(window.location.search).get("movieId");
}
