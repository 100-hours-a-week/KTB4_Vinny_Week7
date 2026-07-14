/**
 * @typedef {Object} ReviewCreateRequest
 * @property {string} content
 */

/**
 * @typedef {Object} ReviewUpdateRequest
 * @property {string} content
 */

/**
 * @typedef {Object} ReviewResponse
 * @property {string} reviewId
 * @property {string} content
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {boolean} isOwner
 * @property {import('./user.js').AuthorSummaryResponse} author
 */

/**
 * @typedef {Object} ReviewListResponse
 * @property {number} reviewCount
 * @property {ReviewResponse[]} reviews
 */

export {};
