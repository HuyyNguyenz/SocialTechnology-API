export const USER_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  EMAIL_IS_NOT_VALID: 'Email is not valid',
  EMAIL_IS_ALREADY_EXISTS: 'Email is already exists',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password incorrect',
  EMAIL_NOT_VERIFY: 'Email not verify',
  EMAIL_NOT_FOUND: 'Email not found',
  PASSWORD_IS_NOT_EMPTY: 'Password is not empty',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-32 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  FIRST_NAME_MUST_BE_STRING: 'First name must be string',
  FIRST_NAME_IS_NOT_EMPTY: 'First name is not empty',
  LAST_NAME_MUST_BE_STRING: 'Last name must be string',
  LAST_NAME_IS_NOT_EMPTY: 'Last name is not empty',
  BIRTHDAY_IS_NOT_EMPTY: 'Birthday is not empty',
  BIRTHDAY_IS_NOT_VALID: 'Birthday is not valid (DD/MM/YYYY)',
  CREATED_AT_IS_NOT_EMPTY: 'Created at is not empty',
  CREATED_AT_IS_NOT_VALID: 'Created at is not valid (DD/MM/YYYY)',
  GENDER_IS_NOT_EMPTY: 'Gender is not empty',
  GENDER_IS_NOT_VALID: 'Gender is not valid (male or female)',
  USERNAME_IS_NOT_EMPTY: 'Username is not empty',
  USERNAME_MUST_BE_STRING: 'Username must be string',
  USERNAME_NOT_FOUND: 'Username not found',
  LOGIN_SUCCESSFULLY: 'Login successfully',
  LOGOUT_SUCCESSFULLY: 'Logout successfully',
  VERIFY_USER_SUCCESSFULLY: 'Verify user successfully',
  REFRESH_TOKEN_IS_NOT_EMPTY: 'Refresh token is not empty',
  REFRESH_TOKEN_IS_NOT_EXISTS: 'Refresh token is not exists',
  REFRESH_TOKEN_IS_NOT_VALID: 'Refresh token is not valid',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  OTP_CODE_IS_NOT_EMPTY: 'Otp code is not empty',
  OTP_CODE_IS_NOT_CORRECT: 'Otp code is not correct',
  UPDATE_PASSWORD_SUCCESSFULLY: 'Update password successfully',
  UPDATE_PROFILE_SUCCESSFULLY: 'Update profile successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_NOT_VALID: 'Access token is not valid',
  IMAGE_MUST_BE_STRING: 'Image must be string',
  VALIDATION_ERROR: 'Validation error'
} as const

export const POST_MESSAGES = {
  CREATED_AT_IS_NOT_EMPTY: 'Created at is not empty',
  CREATED_AT_IS_NOT_VALID: 'Created at is not valid (DD/MM/YYYY HH:MM)',
  MODIFIED_AT_IS_NOT_EMPTY: 'Modified at is not empty',
  MODIFIED_AT_IS_NOT_VALID: 'Modified at is not valid (DD/MM/YYYY HH:MM)',
  USER_ID_MUST_BE_NUMBER: 'User id must be number',
  COMMUNITY_ID_MUST_BE_NUMBER: 'Community id must be number',
  USER_ID_NOT_FOUND: 'User id not found',
  TYPE_IS_NOT_VALID: 'Type is not valid (public or private)',
  CREATED_POST_SUCCESSFULLY: 'Created post successfully',
  POST_ID_NOT_FOUND: 'Post id not found',
  POST_ID_MUST_BE_NUMBER: 'Post id must be number',
  TYPE_POST_SHARE_IS_NOT_VALID: 'Type post share is not valid (share or shareTo)',
  SHARED_POST_SUCCESSFULLY: 'Shared post successfully',
  TYPE_POST_LIKE_MUST_BE_STRING: 'Type post like must be string',
  TYPE_POST_LIKE_IS_NOT_VALID: 'Type post like is not valid ( like )',
  LIKED_POST_SUCCESSFULLY: 'Liked post successfully',
  DELETED_POST_SUCCESSFULLY: 'Deleted post successfully',
  USER_ID_IS_NOT_MATCHED_BY_POST: 'User id is not matched by post',
  ID_LIKE_POST_IS_NOT_FOUND: 'Id like post is not found',
  UNLIKE_POST_SUCCESSFULLY: 'Unlike post successfully',
  UPDATE_POST_SUCCESSFULLY: 'Update post successfully'
} as const

export const COMMENT_MESSAGES = {
  CREATED_AT_IS_NOT_EMPTY: 'Created at is not empty',
  CREATED_AT_IS_NOT_VALID: 'Created at is not valid (DD/MM/YYYY HH:MM)',
  MODIFIED_AT_IS_NOT_EMPTY: 'Modified at is not empty',
  MODIFIED_AT_IS_NOT_VALID: 'Modified at is not valid (DD/MM/YYYY HH:MM)',
  COMMENT_ID_MUST_BE_NUMBER: 'Comment id must be number',
  COMMENT_ID_NOT_FOUND: 'Comment id not found',
  COMMENT_POST_SUCCESSFULLY: 'Comment post successfully',
  DELETE_COMMENT_SUCCESSFULLY: 'Delete comment successfully',
  UPDATE_COMMENT_SUCCESSFULLY: 'Update comment successfully'
} as const

export const FRIEND_MESSAGES = {
  ID_MUST_BE_NUMBER: 'Id must be number',
  ID_NOT_FOUND: 'Id not found',
  FRIEND_ID_MUST_BE_NUMBER: 'Friend id must be number',
  FRIEND_ID_NOT_FOUND: 'Friend id not found',
  FRIEND_STATUS_IS_NOT_VALID: 'Friend status is not valid',
  SENT_REQUEST_ADD_FRIEND_SUCCESSFULLY: 'Sent request add friend successfully',
  CANCELED_REQUEST_ADD_FRIEND_SUCCESSFULLY: 'Canceled request add friend successfully',
  ACCEPTED_FRIEND_SUCCESSFULLY: 'Accepted friend successfully'
} as const

export const NOTIFY_MESSAGES = {
  NOTIFY_ID_MUST_BE_NUMBER: 'Notify id must be number',
  NOTIFY_ID_NOT_FOUND: 'Notify id not found',
  UPDATE_NOTIFY_SUCCESSFULLY: 'Update notify successfully'
}

export const MESSAGE_MESSAGES = {
  CREATED_AT_IS_NOT_EMPTY: 'Created at is not empty',
  CREATED_AT_IS_NOT_VALID: 'Created at is not valid (DD/MM/YYYY HH:MM)',
  MODIFIED_AT_IS_NOT_EMPTY: 'Modified at is not empty',
  MODIFIED_AT_IS_NOT_VALID: 'Modified at is not valid (DD/MM/YYYY HH:MM)',
  FRIEND_ID_MUST_BE_NUMBER: 'Friend id must be number',
  FRIEND_ID_NOT_FOUND: 'Friend id not found',
  SENT_MESSAGE_SUCCESSFULLY: 'Sent message successfully',
  FRIEND_IS_NOT_EXISTS: 'Friend is not exists',
  MESSAGE_ID_MUST_BE_NUMBER: 'Message id must be number',
  MESSAGE_ID_NOT_FOUND: 'Message id not found',
  DELETE_MESSAGE_SUCCESSFULLY: 'Delete message successfully',
  UPDATE_MESSAGE_SUCCESSFULLY: 'Update message successfully'
}
