export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByEmail(email: string): Promise<any>; // or Promise<User | null>
  simpan(user: any): Promise<any>;
  buat(dto: any): any;
}
