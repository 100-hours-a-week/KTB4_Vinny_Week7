import { request } from "./api.js";

function createPostFormData(payload) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("content", payload.content);
  payload.images.forEach(function(image) {
    formData.append("images", image);
  });

  return formData;
}

/**
 * @param {string} userId
 * @param {import('../types/post.js').PostCreateRequest} payload
 * @returns {Promise<import('../types/post.js').PostDetailResponse>}
 */

export function createPost(userId, payload) {
  return request(`/users/${userId}/posts`, {
    method: "POST",
    body: createPostFormData(payload)
  });
}

/**
 * @returns {Promise<import('../types/post.js').PostListResponse[]>}
 */
export function getPosts() {
  return request("/posts");
}

/**
 * @param {string} postId 
 * @returns {Promise<import('../types/post.js').PostDetailResponse>}
 */

export function getPost(postId) {
  return request(`/posts/${postId}`);
}

/**
 * @param {string} postId
 * @param {import('../types/post.js').PostUpdateRequest} payload
 * @returns {Promise<import('../types/post.js').PostDetailResponse>}
 */

export function updatePost(postId, payload) {
  return request(`/posts/${postId}`, {
    method: "PATCH",
    body: createPostFormData(payload)
  });
}

/**
 * @param {string} postId 
 * @returns {Promise<void>}
 */

export function deletePost(postId) {
  return request(`/posts/${postId}`, {
    method: "DELETE"
  });
}

/**
 * @param {string} userId 
 * @param {string} postId 
 * @returns {Promise<import('../types/post.js').PostLikeResponse>}
 */

export function likePost(userId, postId) {
  return request(`/users/${userId}/posts/${postId}/likes`, {
    method: "POST"
  });
}
