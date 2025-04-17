import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from './domain/repositories/user.repository.interface';
import { RegisterUserDto } from './application/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    // ⬇️ Tambahkan ini untuk bisa gunakan this.jwtService
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah digunakan');
    }

    const user = this.userRepository.buat(dto);
    user.password = await bcrypt.hash(dto.password, 10);

    return await this.userRepository.simpan(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload); // ✅ Sekarang tidak error

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}
