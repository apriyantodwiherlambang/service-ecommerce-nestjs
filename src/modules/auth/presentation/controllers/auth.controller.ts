import {
  Controller,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
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
    try {
      const user = await this.registerUseCase.execute(dto);
      return { pesan: 'Registrasi berhasil', user };
    } catch (error: any) {
      // ConflictException dilempar dari use case saat email sudah digunakan
      if (error instanceof ConflictException) {
        throw new ConflictException({
          statusCode: 409,
          message: 'Email sudah digunakan',
          error: 'Conflict',
        });
      }

      // Validasi dari DTO biasanya ditangani ValidationPipe
      // Tapi kalau kamu punya validasi custom lainnya, bisa masuk sini

      console.error('Error saat registrasi:', error);

      // Error lain (ex: koneksi DB) ditangani sebagai 500
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Terjadi kesalahan tak terduga saat registrasi',
        error: 'Internal Server Error',
      });
    }
  }
}
