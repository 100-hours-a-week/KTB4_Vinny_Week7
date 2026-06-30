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

export async function createPost(userId, payload) {
  return await request(`/users/${userId}/posts`, {
    method: "POST",
    body: createPostFormData(payload)
  });
}

/**
 * @returns {Promise<import('../types/post.js').PostListResponse[]>}
 */
export async function getPosts() {
  return await request("/posts");
}

/**
 * @param {string} postId 
 * @returns {Promise<import('../types/post.js').PostDetailResponse>}
 */

export async function getPost(postId) {
  return await request(`/posts/${postId}`);
}

/**
 * @param {string} postId
 * @param {import('../types/post.js').PostUpdateRequest} payload
 * @returns {Promise<import('../types/post.js').PostDetailResponse>}
 */

export async function updatePost(postId, payload) {
  return await request(`/posts/${postId}`, {
    method: "PATCH",
    body: createPostFormData(payload)
  });
}

/**
 * @param {string} postId 
 * @returns {Promise<void>}
 */

export async function deletePost(postId) {
  return await request(`/posts/${postId}`, {
    method: "DELETE"
  });
}

/**
 * @param {string} userId 
 * @param {string} postId 
 * @returns {Promise<import('../types/post.js').PostLikeResponse>}
 */

export async function likePost(userId, postId) {
  return await request(`/users/${userId}/posts/${postId}/likes`, {
    method: "POST"
  });
}
