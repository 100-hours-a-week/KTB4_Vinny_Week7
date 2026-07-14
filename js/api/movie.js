import { request } from "./api.js";

/**
 * @returns {Promise<import('../types/movie.js').MovieListResponse[]>}
 */
export async function getMovies() {
  return await request("/movies");
}

/**
 * @param {string} movieId 
 * @returns {Promise<import('../types/movie.js').MovieDetailResponse>}
 */

export async function getMovie(movieId) {
  return await request(`/movies/${movieId}`);
}

/**
 * @param {string} movieId 
 * @returns {Promise<import('../types/movie.js').MovieLikeResponse>}
 */

export async function likeMovie(movieId) {
  return await request(`/movies/${movieId}/likes`, {
    method: "POST"
  });
}
