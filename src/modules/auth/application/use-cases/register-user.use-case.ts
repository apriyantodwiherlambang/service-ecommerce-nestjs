// src/modules/auth/application/use-cases/register-user.use-case.ts
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: RegisterUserDto) {
    const existingUser = await this.userRepo.cariByEmail(dto.email);
    if (existingUser) {
      throw new Error('User dengan email ini sudah ada');
    }

    const newUser = this.userRepo.buat(dto);
    newUser.password = await bcrypt.hash(dto.password, 10);
    return await this.userRepo.simpan(newUser);
  }
}
