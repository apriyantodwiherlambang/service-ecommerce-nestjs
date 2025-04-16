import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from './domain/repositories/user.repository.interface';
import { RegisterUserDto } from './application/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) // ✅ gunakan konstanta, bukan string literal
    private readonly userRepository: IUserRepository,
  ) {}

  async register(dto: RegisterUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah digunakan');
    }

    const user = this.userRepository.buat(dto);
    user.password = await bcrypt.hash(dto.password, 10);

    return await this.userRepository.simpan(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // TODO: return JWT token or other login result
    return user;
  }
}
