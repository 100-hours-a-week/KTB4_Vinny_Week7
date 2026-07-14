/**
 * @typedef {Object} MovieListResponse
 * @property {string} movieId
 * @property {string} title
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} likeCount
 * @property {number} reviewCount
 * @property {import('./user.js').AuthorSummaryResponse} author
 */

/**
 * @typedef {Object} MovieDetailResponse
 * @property {string} movieId
 * @property {string} title
 * @property {string} content
 * @property {string[]} images
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} likeCount
 * @property {number} reviewCount
 * @property {number} viewCount
 * @property {boolean} isOwner
 * @property {boolean} isLiked
 * @property {import('./user.js').AuthorSummaryResponse} author
 */

/**
 * @typedef {Object} MovieLikeResponse
 * @property {boolean} likes
 */

export {};
