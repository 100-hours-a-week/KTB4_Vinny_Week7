/**
 * @typedef {Object} UserCreateRequest
 * @property {string} email - 사용자의 이메일
 * @property {string} password - 사용자의 비밀번호
 * @property {string} passwordConfirm - 사용자의 비밀번호 확인
 * @property {string} nickname - 사용자의 닉네임
 * @property {string} profileImageUrl - 사용자의 프로필 이미지 URL
 */

/**
 * @typedef {Object} UserUpdatePasswordRequest
 * @property {string} password - 사용자의 현재 비밀번호
 * @property {string} passwordConfirm - 사용자의 새로운 비밀번호 확인
 */

/**
 * @typedef {Object} UserUpdateProfileRequest
 * @property {string} nickname - 사용자의 닉네임
 * @property {string} profileImageUrl - 사용자의 프로필 이미지 URL
 */

/**
 * @typedef {Object} UserSignInRequest
 * @property {string} email - 사용자의 이메일
 * @property {string} password - 사용자의 비밀번호
 */

/**
 * @typedef {Object} UserWithdrawRequest
 * @property {number} withdrawReasonType - 사용자의 탈퇴 사유 타입
 * @property {string} withdrawReasonDetail - 사용자의 탈퇴 사유
 */

/**
 * @typedef {Object} UserResponse
 * @property {string} id - 사용자의 고유 ID
 * @property {string} email - 사용자의 이메일
 * @property {string} nickname - 사용자의 닉네임
 * @property {string} profileImageUrl - 사용자의 프로필 이미지 URL
 */

/**
 * @typedef {Object} UserSignInResponse
 * @property {string} token - 사용자의 액세스 토큰
 * @property {string} userId - 사용자의 고유 ID
 */

/**
 * @typedef {Object} UserIdResponse
 * @property {string} userId - 사용자의 고유 ID
 */

/**
 * @typedef {Object} AuthorSummaryResponse
 * @property {string} nickname - 작성자의 닉네임
 * @property {string} profileImageUrl - 작성자의 프로필 이미지 URL
 */

export {};