// src/modules/auth/application/use-cases/login.use-case.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: LoginUserDto) {
    const result = await this.authService.login(dto.email, dto.password);
    if (!result) {
      throw new UnauthorizedException('Email atau password salah');
    }
    return result;
  }
}
