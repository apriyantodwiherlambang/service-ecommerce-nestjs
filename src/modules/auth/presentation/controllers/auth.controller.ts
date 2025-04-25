// src/modules/auth/controllers/auth.controller.ts
import {
  Controller,
  Post,
  Put,
  Param,
  Body,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { LoginUserUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { JwtAuthGuard } from '../../application/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUserUseCase,
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
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
      if (error instanceof ConflictException) {
        throw new ConflictException({
          statusCode: 409,
          message: 'Email sudah digunakan',
          error: 'Conflict',
        });
      }

      console.error('Error saat registrasi:', error);

      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Terjadi kesalahan tak terduga saat registrasi',
        error: 'Internal Server Error',
      });
    }
  }

  @Put('id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update data pengguna' })
  @ApiResponse({ status: 200, description: 'Berhasil update data pengguna' })
  async update(@Req() req: Request, @Body() dto: UpdateUserDto) {
    try {
      if (!req.user) {
        throw new BadRequestException('User tidak ditemukan dalam permintaan');
      }

      const user = req.user as { id: number; email: string };
      const userId = user.id; // Mendapatkan userId dari token JWT
      const updatedUser = await this.updateUserUseCase.execute(userId, dto);
      return { message: 'Update berhasil', user: updatedUser };
    } catch (error: any) {
      this.handleUpdateError(error);
    }
  }

  // Update berdasarkan ID yang diterima dari parameter URL
  @Put('user/update/:id')
  @ApiOperation({ summary: 'Update data pengguna berdasarkan ID' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil update data pengguna berdasarkan ID',
  })
  async updateUser(
    @Param('id') id: string, // Mendapatkan parameter 'id' dari URL
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.updateUserUseCase.execute(
        parseInt(id),
        updateUserDto,
      );
      return { message: 'Update berhasil', user: updatedUser };
    } catch (error: any) {
      this.handleUpdateError(error);
    }
  }

  // Helper method to handle registration errors
  private handleRegistrationError(error: any) {
    if (error instanceof ConflictException) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Email sudah digunakan',
        error: 'Conflict',
      });
    }

    console.error('Error saat registrasi:', error);
    throw new InternalServerErrorException({
      statusCode: 500,
      message: 'Terjadi kesalahan tak terduga saat registrasi',
      error: 'Internal Server Error',
    });
  }

  // Helper method to handle update errors
  private handleUpdateError(error: any) {
    if (error instanceof ConflictException) {
      throw new ConflictException({
        statusCode: 409,
        message: 'Email sudah digunakan oleh user lain',
        error: 'Conflict',
      });
    }

    if (error instanceof NotFoundException) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User tidak ditemukan',
        error: 'Not Found',
      });
    }

    if (error instanceof BadRequestException) {
      throw new BadRequestException({
        statusCode: 400,
        message: error.message,
        error: 'Bad Request',
      });
    }

    console.error('Error saat update:', error);
    throw new InternalServerErrorException({
      statusCode: 500,
      message: 'Terjadi kesalahan tak terduga saat update data',
      error: 'Internal Server Error',
    });
  }
}
