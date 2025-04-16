// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './presentation/controllers/auth.controller';
import { User } from './infrastructure/entities/user.entity';
import { UserRepository } from './infrastructure/database/user.repository';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
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
