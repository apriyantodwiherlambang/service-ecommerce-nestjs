import { DataSource } from 'typeorm';
import { User } from './modules/auth/infrastructure/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  migrations: [__dirname + '/migrations/*.ts'], // Pastikan path migrasi benar
  synchronize: false,
  logging: true, // Menambahkan logging untuk debugging
});
