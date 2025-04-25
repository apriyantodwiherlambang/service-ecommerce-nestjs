import { User } from '../../modules/auth/infrastructure/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string };
    }
  }
}

export {}; // ⬅️ ini penting untuk menghindari "Cannot redeclare block-scoped variable"
