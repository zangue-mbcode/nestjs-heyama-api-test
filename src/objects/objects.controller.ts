import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';
import { CreateObjectDto } from './dto/create-object.dto';

@Controller('objects')
export class ObjectsController {
  constructor(
    private objectsService: ObjectsService,
    private objectsGateway: ObjectsGateway,
  ) {}

  /**
   * Create a new object with image upload
   * POST /objects
   * Expected: multipart/form-data with title, description, and file
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createObjectDto: CreateObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createdObject = await this.objectsService.create(
      createObjectDto,
      file,
    );

    // Emit Socket.IO event to notify all connected clients
    this.objectsGateway.emitObjectCreated(createdObject);

    return createdObject;
  }

  /**
   * Get all objects
   * GET /objects
   */
  @Get()
  async findAll() {
    return await this.objectsService.findAll();
  }

  /**
   * Get a specific object by ID
   * GET /objects/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.objectsService.findOne(id);
  }

  /**
   * Delete an object
   * DELETE /objects/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.objectsService.delete(id);

    // Emit Socket.IO event to notify all connected clients
    this.objectsGateway.emitObjectDeleted(id);
  }
}
