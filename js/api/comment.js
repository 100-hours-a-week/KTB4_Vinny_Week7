import { request } from "./api.js";

/**
 * @param {string} userId 
 * @param {string} postId 
 * @param {import('../types/comment.js').CommentCreateRequest} payload
 * @returns {Promise<import('../types/comment.js').CommentResponse>}
 */

export function createComment(userId, postId, payload) {
  return request(`/users/${userId}/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} postId
 * @returns {Promise<import('../types/comment.js').CommentResponse[]>}
 */

export function getComments(postId) {
  return request(`/posts/${postId}/comments`);
}

/**
 * @param {string} postId 
 * @param {string} commentId 
 * @param {import('../types/comment.js').CommentUpdateRequest} payload 
 * @returns {Promise<import('../types/comment.js').CommentResponse | void>}
 */

export function updateComment(postId, commentId, payload) {
  return request(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * 
 * @param {string} postId 
 * @param {string} commentId 
 * @returns {Promise<void>}
 */

export function deleteComment(postId, commentId) {
  return request(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE"
  });
}
