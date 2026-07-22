/**
 * @typedef {Object} UserCreateRequest
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 * @property {string} nickname
 * @property {File | string | null} profileImage
 */

/**
 * @typedef {Object} UserUpdatePasswordRequest
 * @property {string} password
 * @property {string} passwordConfirm
 */

/**
 * @typedef {Object} UserUpdateProfileRequest
 * @property {string} nickname
 * @property {File | string | null} profileImage
 */

/**
 * @typedef {Object} UserLoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} UserWithdrawRequest
 * @property {number} withdrawReasonType
 * @property {string} withdrawReasonDetail
 */

/**
 * @typedef {Object} UserResponse
 * @property {string} id
 * @property {string} email
 * @property {string} nickname
 * @property {string | null} profileImage
 */

/**
 * @typedef {Object} UserLoginResponse
 * @property {string} accessToken
 * @property {string} userId
 */

/**
 * @typedef {Object} UserIdResponse
 * @property {string} userId
 */

/**
 * @typedef {Object} UserProfileResponse
 * @property {string} nickname
 * @property {string | null} profileImage
 */

/**
 * @typedef {Object} AuthorSummaryResponse
 * @property {string} nickname
 * @property {string | null} profileImage
 */

export {};
