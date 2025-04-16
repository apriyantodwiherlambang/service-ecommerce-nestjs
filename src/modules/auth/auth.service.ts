// src/modules/auth/application/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const user = this.userRepository.buat(dto);
    user.password = await bcrypt.hash(dto.password, 10);
    return await this.userRepository.simpan(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.cariByEmail(email);
    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Password salah');

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
