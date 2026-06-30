import { request } from "./api.js";
/**
 * @param {import('../types/user.js').UserCreateRequest} payload
 * @returns {Promise<import('../types/user.js').UserIdResponse>}
 */

export async function signUp(payload) {
  return await request("/users/sign-up", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {import('../types/user.js').UserSignInRequest} payload
 * @returns {Promise<import('../types/user.js').UserSignInResponse>}
 */

export async function signIn(payload) {
  return await request("/users/sign-in", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserUpdateProfileRequest} payload
 * @returns {Promise<import('../types/user.js').AuthorSummaryResponse>}
 */

export async function updateUserProfile(userId, payload) {
  return await request(`/users/${userId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserUpdatePasswordRequest} payload
 * @returns {Promise<void>}
 */

export async function updateUserPassword(userId, payload) {
  return await request(`/users/${userId}/password`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserWithdrawRequest} payload
 * @returns {Promise<void>}
 */

export async function withdrawUser(userId, payload) {
  return await request(`/users/${userId}/withdraw`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {string} userId
 * @returns {Promise<import('../types/user.js').UserResponse>}
 */
export async function getUserInfo(userId) {
  return await request(`/users/${userId}`);
}

export async function signOut() {
  return await request("/users/sign-out", {
    method: "POST"
  });
}
