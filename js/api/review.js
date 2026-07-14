import { request } from "./api.js";

/**
 * @param {string} movieId 
 * @param {import('../types/review.js').ReviewCreateRequest} payload
 * @returns {Promise<import('../types/review.js').ReviewListResponse>}
 */

export async function createReview(movieId, payload) {
  return await request(`/movies/${movieId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} movieId
 * @returns {Promise<import('../types/review.js').ReviewListResponse>}
 */

export async function getReviews(movieId) {
  return await request(`/movies/${movieId}/reviews`);
}

/**
 * @param {string} movieId 
 * @param {string} reviewId 
 * @param {import('../types/review.js').ReviewUpdateRequest} payload 
 * @returns {Promise<import('../types/review.js').ReviewListResponse>}
 */

export async function updateReview(movieId, reviewId, payload) {
  return await request(`/movies/${movieId}/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} movieId 
 * @param {string} reviewId 
 * @returns {Promise<import('../types/review.js').ReviewListResponse>}
 */

export async function deleteReview(movieId, reviewId) {
  return await request(`/movies/${movieId}/reviews/${reviewId}`, {
    method: "DELETE"
  });
}
