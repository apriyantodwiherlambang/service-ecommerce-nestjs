// src/data-source.ts
import { DataSource } from 'typeorm';
import { User } from './modules/auth/infrastructure/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '',
  database: 'postgres',
  entities: ['dist/**/*.entity.js'], // atau ['dist/modules/**/*.entity.js']
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
});
