// src/modules/auth/application/use-cases/login.use-case.ts
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: LoginUserDto) {
    return await this.authService.login(dto.email, dto.password);
  }
}
