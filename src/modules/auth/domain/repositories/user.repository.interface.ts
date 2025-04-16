// src/modules/auth/domain/repositories/user.repository.interface.ts
import { User } from '../../infrastructure/entities/user.entity';

export interface IUserRepository {
  cariByEmail(email: string): Promise<User | null>;
  simpan(user: User): Promise<User>;
  buat(dto: any): User;
}
