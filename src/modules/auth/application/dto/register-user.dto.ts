import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'john_doe' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @MinLength(3, { message: 'Username minimal 3 karakter' })
  @MaxLength(20, { message: 'Username maksimal 20 karakter' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'strongpass123' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password harus mengandung huruf dan angka',
  })
  password: string;
}
