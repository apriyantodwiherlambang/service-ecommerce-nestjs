// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm'; // Menambahkan DataSource
import { AuthController } from './modules/auth/presentation/controllers/auth.controller';
import { UserRepository } from './modules/auth/infrastructure/database/user.repository';
import { RegisterUserUseCase } from './modules/auth/application/use-cases/register-user.use-case';
import { User } from './modules/auth/infrastructure/entities/user.entity';
import { AuthService } from './modules/auth/application/services/auth.service';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule untuk otentikasi
import { AuthModule } from './modules/auth/auth.module'; // Pastikan AuthModule diimpor

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'postgres',
      entities: [User], // Menghubungkan entitas User
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserRepository]), // Menghubungkan UserRepository ke module
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key', // Gantilah dengan secret key yang lebih aman
      signOptions: { expiresIn: '1h' }, // Pengaturan untuk masa berlaku JWT
    }),
    AuthModule, // Pastikan AuthModule ada di imports
  ],
  controllers: [AuthController],
  providers: [UserRepository, RegisterUserUseCase, AuthService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {} // Menambahkan DataSource untuk akses DB
}
