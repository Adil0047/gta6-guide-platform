import { type UserRole } from '@gta6-guide/shared/roles';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
      email: string;
      username: string;
    }

    interface Request {
      user?: User;
      requestId?: string;
    }
  }
}

export {};
