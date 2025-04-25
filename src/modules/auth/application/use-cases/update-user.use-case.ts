// src/modules/auth/application/use-cases/update-user.use-case.ts
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Cek email baru apakah sudah digunakan user lain
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Email sudah digunakan oleh user lain');
      }
    }

    // Cek apakah password baru sama dengan yang lama
    const isSamePassword = await bcrypt.compare(dto.password, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'Password baru tidak boleh sama dengan password lama',
      );
    }

    user.username = dto.username;
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 10);

    return await this.userRepository.simpan(user);
  }
}
