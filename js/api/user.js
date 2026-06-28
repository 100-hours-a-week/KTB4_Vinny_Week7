import { request } from "./api.js";
/**
 * @param {import('../types/user.js').UserCreateRequest} signUpUser
 * @returns {Promise<import('../types/user.js').UserIdResponse>}
 */

export function signUp(signUpUser) {
  return request("/users/sign-up", {
    method: "POST",
    body: JSON.stringify(signUpUser)
  });
}

/**
 * @param {import('../types/user.js').UserSignInRequest} signInUser
 * @returns {Promise<import('../types/user.js').UserSignInResponse>}
 */

export function signIn(signInUser) {
  return request("/users/sign-in", {
    method: "POST",
    body: JSON.stringify(signInUser)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserUpdateProfileRequest} updateProfileUser
 * @returns {Promise<import('../types/user.js').AuthorSummaryResponse>}
 */

export function updateUserProfile(userId, updateProfileUser) {
  return request(`/users/${userId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(updateProfileUser)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserUpdatePasswordRequest} updateUserPassword
 * @returns {Promise<void>}
 */

export function updateUserPassword(userId, updateUserPassword) {
  return request(`/users/${userId}/password`, {
    method: "PATCH",
    body: JSON.stringify(updateUserPassword)
  });
}

/**
 * @param {string} userId
 * @param {import('../types/user.js').UserWithdrawRequest} withdrawUser
 * @returns {Promise<string>}
 */

export function withdrawUser(userId) {
  return request(`/users/${userId}/withdraw`, {
    method: "PATCH"
  });
}

export function getUserInfo(userId) {
  return request(`/users/${userId}`);
}

export function signOut() {
  return request("/users/sign-out", {
    method: "POST"
  });
}





