import { request } from "./api.js";

function createUserFormData(payload) {
  const formData = new FormData();

  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("passwordConfirm", payload.passwordConfirm);
  formData.append("nickname", payload.nickname);
  payload.profileImageUrl && formData.append("profileImageUrl", payload.profileImageUrl);

  return formData;
}

function updateUserFormData(payload) {
  const formData = new FormData();

  formData.append("nickname", payload.nickname);
  
  if (payload.profileImageUrl instanceof File) {
    formData.append("profileImageUrl", payload.profileImageUrl);
  } else if (payload.profileImageUrl && typeof payload.profileImageUrl === 'string') {
    formData.append("profileImageUrl", payload.profileImageUrl);
  }

  return formData;
}

/**
 * @param {import('../types/user.js').UserCreateRequest} payload
 * @returns {Promise<import('../types/user.js').UserIdResponse>}
 */

export async function signUp(payload) {
  return await request("/sign-up", {
    method: "POST",
    body: createUserFormData(payload)
  });
}

/**
 * @param {import('../types/user.js').UserLoginRequest} payload
 * @returns {Promise<import('../types/user.js').UserLoginResponse>}
 */

export async function login(payload) {
  return await request("/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {import('../types/user.js').UserUpdateProfileRequest} payload
 * @returns {Promise<import('../types/user.js').UserProfileResponse>}
 */

export async function updateUserProfile(payload) {
  return await request(`/users/me/profile`, {
    method: "PATCH",
    body: updateUserFormData(payload)
  });
}

/**
 * @param {import('../types/user.js').UserUpdatePasswordRequest} payload
 * @returns {Promise<void>}
 */

export async function updateUserPassword(payload) {
  return await request(`/users/me/password`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @param {import('../types/user.js').UserWithdrawRequest} payload
 * @returns {Promise<void>}
 */

export async function withdrawUser(payload) {
  return await request(`/users/me/withdraw`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

/**
 * @returns {Promise<import('../types/user.js').UserResponse>}
 */
export async function getUserInfo() {
  return await request(`/users/me`);
}

export async function logout() {
  return await request("/logout", {
    method: "POST"
  });
}
