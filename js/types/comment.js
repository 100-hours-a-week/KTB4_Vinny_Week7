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
 * @property {import('./user.js').AuthorSummaryResponse} author
 */

export {};
