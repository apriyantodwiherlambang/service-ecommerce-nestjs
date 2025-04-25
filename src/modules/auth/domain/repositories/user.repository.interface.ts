export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByEmail(email: string): Promise<any>;
  findById(id: number): Promise<any>;
  simpan(user: any): Promise<any>;
  buat(dto: any): any;
}
