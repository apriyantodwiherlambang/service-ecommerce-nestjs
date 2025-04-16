import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterUserDto) {
    // Cek apakah email sudah terdaftar
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah digunakan');
    }

    // Buat user baru dan hash password
    const user = this.userRepository.buat(dto);
    user.password = await bcrypt.hash(dto.password, 10);

    // Simpan user
    return await this.userRepository.simpan(user);
  }
}
