/**
 * Application constants
 */

// File Upload
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation
export const TITLE_MIN_LENGTH = 1;
export const TITLE_MAX_LENGTH = 255;

export const DESCRIPTION_MIN_LENGTH = 1;
export const DESCRIPTION_MAX_LENGTH = 2000;

// API
export const API_VERSION = 'v1';

// Error Messages
export const ERROR_MESSAGES = {
  FILE_NOT_PROVIDED: 'No file provided',
  INVALID_FILE_TYPE: 'Invalid file type. Allowed types: image/jpeg, image/png, image/gif, image/webp',
  FILE_TOO_LARGE: 'File size must not exceed 5MB',
  S3_UPLOAD_FAILED: 'Failed to upload image to S3',
  OBJECT_NOT_FOUND: 'Object not found',
  DATABASE_ERROR: 'Database operation failed',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  OBJECT_CREATED: 'Object created successfully',
  OBJECT_DELETED: 'Object deleted successfully',
  OBJECTS_RETRIEVED: 'Objects retrieved successfully',
};
