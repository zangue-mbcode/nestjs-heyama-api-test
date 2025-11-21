import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getDatabaseConfig } from './config/database.config';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [
    MongooseModule.forRoot(getDatabaseConfig().uri),
    ObjectsModule,
  ],
})
export class AppModule {}
