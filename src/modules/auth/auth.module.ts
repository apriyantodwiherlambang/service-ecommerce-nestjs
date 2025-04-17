// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Tambahkan ini
import { AuthService } from './auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { User } from './infrastructure/entities/user.entity';
import { UserRepository } from './infrastructure/database/user.repository';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

@Module({
  imports: [
    ConfigModule, // pastikan ConfigModule tersedia di sini
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // agar bisa akses config
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterUserUseCase,
    LoginUserUseCase,
    UserRepository,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [
    AuthService,
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
