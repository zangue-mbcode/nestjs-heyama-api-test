import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectDocument } from './schemas/object.schema';
import { CreateObjectDto } from './dto/create-object.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(ObjectDocument.name) private objectModel: Model<ObjectDocument>,
    private uploadService: UploadService,
  ) {}

  /**
   * Create a new object with image upload
   * @param createObjectDto - Object data (title, description)
   * @param file - Image file from Multer
   * @returns Created object with image URL
   */
  async create(
    createObjectDto: CreateObjectDto,
    file: Express.Multer.File,
  ): Promise<ObjectDocument> {
    let imageUrl: string | undefined;

    try {
      // Upload image to S3 first
      if (file) {
        imageUrl = await this.uploadService.uploadImage(file);
      }

      // Create object in MongoDB
      const createdObject = new this.objectModel({
        title: createObjectDto.title,
        description: createObjectDto.description,
        imageUrl,
        createdAt: new Date(),
      });

      return await createdObject.save();
    } catch (error) {
      // If image was uploaded but DB save failed, delete the image
      if (imageUrl) {
        await this.uploadService.deleteImage(imageUrl);
      }
      throw error;
    }
  }

  /**
   * Get all objects sorted by creation date (newest first)
   * @returns List of all objects
   */
  async findAll(): Promise<ObjectDocument[]> {
    return await this.objectModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Get a specific object by ID
   * @param id - Object UUID
   * @returns Object data or throws 404
   */
  async findOne(id: string): Promise<ObjectDocument> {
    const obj = await this.objectModel.findOne({ id }).exec();

    if (!obj) {
      throw new NotFoundException(`Object with ID ${id} not found`);
    }

    return obj;
  }

  /**
   * Delete an object and its associated image from S3
   * @param id - Object UUID
   */
  async delete(id: string): Promise<void> {
    const obj = await this.findOne(id);

    try {
      // Delete from MongoDB first
      await this.objectModel.findOneAndDelete({ id }).exec();

      // Then delete from S3 (even if it fails, we don't want to throw)
      if (obj.imageUrl) {
        await this.uploadService.deleteImage(obj.imageUrl);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete object');
    }
  }
}
