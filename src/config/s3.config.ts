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

export interface S3Config {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

/**
 * Get S3 configuration from environment variables
 * @returns S3Config object
 * @throws Error if required environment variables are missing
 */
export function getS3Config(): S3Config {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION || 'auto';
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucketName = process.env.S3_BUCKET_NAME;
  const publicUrl = process.env.S3_PUBLIC_URL;

  // Validate required environment variables
  const missingVars = [];

  if (!endpoint) missingVars.push('S3_ENDPOINT');
  if (!accessKeyId) missingVars.push('S3_ACCESS_KEY_ID');
  if (!secretAccessKey) missingVars.push('S3_SECRET_ACCESS_KEY');
  if (!bucketName) missingVars.push('S3_BUCKET_NAME');
  if (!publicUrl) missingVars.push('S3_PUBLIC_URL');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required S3 configuration environment variables: ${missingVars.join(', ')}. ` +
      `Please ensure your .env file includes all required variables. ` +
      `See src/config/s3.config.ts for an example configuration.`,
    );
  }

  return {
    endpoint: endpoint as string,
    region,
    accessKeyId: accessKeyId as string,
    secretAccessKey: secretAccessKey as string,
    bucketName: bucketName as string,
    publicUrl: publicUrl as string,
  };
}

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
