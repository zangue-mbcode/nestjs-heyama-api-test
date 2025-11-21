import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ObjectsGateway } from './objects.gateway';
import { ObjectDocument, ObjectSchema } from './schemas/object.schema';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ObjectDocument.name, schema: ObjectSchema }]),
    UploadModule,
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectsGateway],
  exports: [ObjectsGateway],
})
export class ObjectsModule {}
