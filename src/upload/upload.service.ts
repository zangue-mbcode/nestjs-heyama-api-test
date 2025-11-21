import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getS3Config, S3Config } from '../config/s3.config';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadService {
  private s3Client!: S3Client;
  private s3Config!: S3Config;

  constructor() {
    this.s3Config = getS3Config();
    this.initializeS3Client();
  }

  private initializeS3Client() {
    this.s3Client = new S3Client({
      region: this.s3Config.region,          // "auto"
      endpoint: this.s3Config.endpoint,      // https://xxxxx.r2.cloudflarestorage.com
      forcePathStyle: true,                  // NECESSAIRE POUR R2
      credentials: {
        accessKeyId: this.s3Config.accessKeyId,
        secretAccessKey: this.s3Config.secretAccessKey,
      },
    });
  }

  /**
   * Upload an image file to S3 and return the public URL
   * @param file - Express Multer file object
   * @returns Public URL of the uploaded file
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size must not exceed ${maxSize / 1024 / 1024}MB`,
      );
    }

    try {
      const fileName = this.generateUniqueFileName(file.originalname);

      const command = new PutObjectCommand({
        Bucket: this.s3Config.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // Return public URL
      return `${this.s3Config.publicUrl}/${fileName}`;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new InternalServerErrorException(
        'Failed to upload image to S3',
      );
    }
  }

  /**
   * Delete a file from S3 by its public URL
   * @param imageUrl - Public URL of the file
   */
  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      return;
    }

    try {
      // Extract the file key from the URL
      const fileKey = this.extractFileKeyFromUrl(imageUrl);

      const command = new DeleteObjectCommand({
        Bucket: this.s3Config.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
    } catch (error) {
      // Log the error but don't throw to avoid cascading failures
      console.error('S3 delete error:', error);
      console.warn(`Failed to delete image from S3: ${imageUrl}`);
    }
  }

  /**
   * Generate a unique file name to avoid collisions
   * @param originalName - Original file name
   * @returns Unique file name
   */
  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = randomBytes(8).toString('hex');
    const extension = originalName.split('.').pop();
    return `objects/${timestamp}-${random}.${extension}`;
  }

  /**
   * Extract the file key from a public URL
   * @param imageUrl - Public URL of the file
   * @returns File key in S3
   */
  private extractFileKeyFromUrl(imageUrl: string): string {
    // Remove the public URL prefix to get the file key
    const urlWithoutPrefix = imageUrl.replace(this.s3Config.publicUrl + '/', '');
    return urlWithoutPrefix;
  }
}
