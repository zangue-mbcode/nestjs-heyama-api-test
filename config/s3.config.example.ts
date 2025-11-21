/**
 * S3 Configuration
 *
 * This file provides the S3 configuration setup for the NestJS API.
 * The actual credentials are loaded from environment variables (.env file).
 *
 * Supported S3-compatible providers:
 * - Cloudflare R2
 * - DigitalOcean Spaces
 * - Backblaze B2
 * - AWS S3
 */

export const s3Config = {
  // S3 endpoint URL (provider-specific)
  endpoint: process.env.S3_ENDPOINT,

  // AWS region (use "auto" for Cloudflare R2)
  region: process.env.S3_REGION || 'us-east-1',

  // S3 credentials
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },

  // Bucket name
  bucket: process.env.S3_BUCKET_NAME,

  // Public URL for accessing uploaded files
  publicUrl: process.env.S3_PUBLIC_URL,
};

/**
 * Example environment variables for different providers:
 *
 * CLOUDFLARE R2:
 * S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
 * S3_REGION=auto
 * S3_ACCESS_KEY_ID=<your-access-key-id>
 * S3_SECRET_ACCESS_KEY=<your-secret-access-key>
 * S3_BUCKET_NAME=heyamo-bucket
 * S3_PUBLIC_URL=https://<your-custom-domain-or-r2-public-url>
 *
 * DIGITALOCEAN SPACES:
 * S3_ENDPOINT=https://<region>.digitaloceanspaces.com
 * S3_REGION=<region>  # e.g., nyc3, sfo3, etc
 * S3_ACCESS_KEY_ID=<your-access-key>
 * S3_SECRET_ACCESS_KEY=<your-secret-key>
 * S3_BUCKET_NAME=heyamo-bucket
 * S3_PUBLIC_URL=https://heyamo-bucket.<region>.cdn.digitaloceanspaces.com
 *
 * BACKBLAZE B2:
 * S3_ENDPOINT=https://s3.<region>.backblazeb2.com
 * S3_REGION=<region>  # e.g., us-west-000, eu-central-001
 * S3_ACCESS_KEY_ID=<application-key-id>
 * S3_SECRET_ACCESS_KEY=<application-key>
 * S3_BUCKET_NAME=heyamo-bucket
 * S3_PUBLIC_URL=https://f000.backblazeb2.com/file/heyamo-bucket
 *
 * AWS S3:
 * S3_ENDPOINT=https://s3.amazonaws.com
 * S3_REGION=us-east-1  # or your region
 * S3_ACCESS_KEY_ID=<your-access-key>
 * S3_SECRET_ACCESS_KEY=<your-secret-key>
 * S3_BUCKET_NAME=heyamo-bucket
 * S3_PUBLIC_URL=https://heyamo-bucket.s3.amazonaws.com
 */
