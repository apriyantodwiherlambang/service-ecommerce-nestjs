// src/modules/auth/controllers/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { LoginUserUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUserUseCase,
    private readonly registerUseCase: RegisterUserUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login pengguna' })
  @ApiResponse({ status: 200, description: 'Berhasil login' })
  async login(@Body() dto: LoginUserDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrasi pengguna baru' })
  @ApiResponse({ status: 201, description: 'Registrasi berhasil' })
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUseCase.execute(dto);
    return { pesan: 'Registrasi berhasil', user };
  }
}
