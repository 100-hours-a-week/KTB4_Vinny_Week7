/**
 * @typedef {Object} CommentCreateRequest
 * @property {string} content
 */

/**
 * @typedef {Object} CommentUpdateRequest
 * @property {string} content
 */

/**
 * @typedef {Object} CommentResponse
 * @property {string} commentId
 * @property {string} content
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {boolean} isOwner
 * @property {import('./user.js').AuthorSummaryResponse} author
 */

/**
 * @typedef {Object} CommentListResponse
 * @property {number} commentCount
 * @property {CommentResponse[]} comments
 */

export {};
