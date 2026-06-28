/**
 * @typedef {Object} UserCreateRequest
 * @property {string} email
 * @property {string} password
 * @property {string} passwordConfirm
 * @property {string} nickname
 * @property {string} profileImageUrl
 */

/**
 * @typedef {Object} UserUpdatePasswordRequest
 * @property {string} password
 * @property {string} passwordConfirm
 */

/**
 * @typedef {Object} UserUpdateProfileRequest
 * @property {string} nickname
 * @property {string} profileImageUrl
 */

/**
 * @typedef {Object} UserSignInRequest
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
 * @property {string | null} profileImageUrl
 */

/**
 * @typedef {Object} UserSignInResponse
 * @property {string} token
 * @property {string} userId
 */

/**
 * @typedef {Object} UserIdResponse
 * @property {string} userId
 */

/**
 * @typedef {Object} AuthorSummaryResponse
 * @property {string} nickname
 * @property {string | null} profileImageUrl
 */

export {};
