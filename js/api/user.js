import { request } from "./api.js";
/**
 * @param {import('../types/user.js').UserCreateRequest} payload
 * @returns {Promise<import('../types/user.js').UserIdResponse>}
 */

export function signUp(payload) {
  return request("/users/sign-up", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {import('../types/user.js').UserSignInRequest} payload
 * @returns {Promise<import('../types/user.js').UserSignInResponse>}
 */

export function signIn(payload) {
  return request("/users/sign-in", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserUpdateProfileRequest} payload
 * @returns {Promise<import('../types/user.js').AuthorSummaryResponse>}
 */

export function updateUserProfile(userId, payload) {
  return request(`/users/${userId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserUpdatePasswordRequest} payload
 * @returns {Promise<void>}
 */

export function updateUserPassword(userId, payload) {
  return request(`/users/${userId}/password`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserWithdrawRequest} payload
 * @returns {Promise<void>}
 */

export function withdrawUser(userId, payload) {
  return request(`/users/${userId}/withdraw`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @returns {Promise<import('../types/user.js').UserResponse>}
 */
export function getUserInfo(userId) {
  return request(`/users/${userId}`);
}

export function signOut() {
  return request("/users/sign-out", {
    method: "POST"
  });
}
