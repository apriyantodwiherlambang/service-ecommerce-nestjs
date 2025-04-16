import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSchema1744825157844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tambahkan perubahan database di sini
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Tambahkan pembatalan perubahan di sini
  }
}
