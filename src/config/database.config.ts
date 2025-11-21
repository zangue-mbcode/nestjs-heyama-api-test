import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getDatabaseConfig = (): {
  uri: string;
} => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ulrichgoualemzangue_db_user:FI88atksFFVrq4wp@heyama.jtmw4tc.mongodb.net/heyama';

  return {
    uri: mongoUri,
  };
};
