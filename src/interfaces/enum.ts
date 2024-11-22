export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

export interface TokenPayload {
  id: string;
  name: string;
}

