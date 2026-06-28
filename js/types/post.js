/**
 * @typedef {Object} PostCreateRequest
 * @property {string} title
 * @property {string} content
 * @property {File[]} images
 */

/**
 * @typedef {Object} PostUpdateRequest
 * @property {string} title
 * @property {string} content
 * @property {File[]} images
 */

/**
 * @typedef {Object} PostListResponse
 * @property {string} postId
 * @property {string} title
 * @property {string} mainImageUrl
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} likeCount
 * @property {number} commentCount
 * @property {number} viewCount
 * @property {import('./user.js').AuthorSummaryResponse} author
 */

/**
 * @typedef {Object} PostDetailResponse
 * @property {string} postId
 * @property {string} title
 * @property {string} content
 * @property {string[]} images
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} likeCount
 * @property {number} commentCount
 * @property {number} viewCount
 * @property {boolean} [likes]
 * @property {import('./user.js').AuthorSummaryResponse} author
 */

/**
 * @typedef {Object} PostLikeResponse
 * @property {boolean} likes
 */

export {};
