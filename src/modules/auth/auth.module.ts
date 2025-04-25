import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './presentation/controllers/auth.controller';

import { User } from './infrastructure/entities/user.entity';
import { UserRepository } from './infrastructure/database/user.repository';

import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';

import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { JwtStrategy } from './application/strategy/jwt.strategy'; // ⬅️ Tambahkan import ini
import { JwtAuthGuard } from './application/guards/jwt-auth.guard'; // ⬅️ Jika perlu menggunakan guard

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
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
    UpdateUserUseCase,
    UserRepository,
    JwtStrategy, // ⬅️ Pastikan JwtStrategy terdaftar
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [
    AuthService,
    RegisterUserUseCase,
    LoginUserUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
