export enum ErrorCode {
  // Common Validation
  V000 = 'common.validation.error',

  // Validation
  V001 = 'user.validation.is_empty',
  V002 = 'user.validation.is_invalid',

  // Error
  E001 = 'user.error.username_or_email_exists',
  E002 = 'user.error.not_found',
  E003 = 'user.error.email_exists',

  // Blog Error
  B001 = 'blog.error.slug_exists',
  B002 = 'blog.error.not_found',

  // Course Error
  C001 = 'course.error.slug_exists',
}
