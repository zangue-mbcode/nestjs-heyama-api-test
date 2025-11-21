import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class ObjectDocument extends Document {
  @Prop({ type: String, default: uuidv4, required: true })
  id!: string;

  @Prop({ required: true, type: String })
  title!: string;

  @Prop({ required: true, type: String })
  description!: string;

  @Prop({ type: String })
  imageUrl!: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt!: Date;
}

export const ObjectSchema = SchemaFactory.createForClass(ObjectDocument);

// Create indexes
ObjectSchema.index({ createdAt: -1 });
ObjectSchema.index({ id: 1 }, { unique: true });
