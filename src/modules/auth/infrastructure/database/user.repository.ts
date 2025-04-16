import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RegisterUserDto } from '../../application/dto/register-user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Implementasi findByEmail sesuai dengan yang ada di IUserRepository
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // Method untuk menyimpan user baru
  async simpan(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  // Method untuk membuat user baru berdasarkan DTO
  buat(dto: RegisterUserDto): User {
    const user = new User();
    user.email = dto.email;
    user.username = dto.username;
    user.password = dto.password; // Pastikan untuk meng-hash password saat diperlukan
    return user;
  }
}
