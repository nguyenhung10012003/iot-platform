import { $Enums } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role: $Enums.Role;
  };
}
