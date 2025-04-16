// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './infrastructure/database/user.repository'; // Impor UserRepository
import { User } from './infrastructure/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])], // Mengimpor User dan UserRepository
  providers: [UserRepository], // Daftarkan UserRepository sebagai provider
  exports: [UserRepository], // Ekspor UserRepository jika perlu digunakan di module lain
})
export class AuthModule {}
