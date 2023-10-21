export const USER_MESSAGES = {
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
