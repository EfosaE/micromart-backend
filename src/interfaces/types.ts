import { $Enums } from '@prisma/client';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

export interface TokenPayload {
  id: string;
  name: string;
  activeRole: $Enums.UserRole; // prisma wants you to use theirs
}

export type FilterOptions = {
  tags?: string[]; // Array of tags to filter by
  minPrice?: number; // Minimum price
  maxPrice?: number; // Maximum price
};

// Define specific types for the context data
export type WelcomeEmailContext = {
  name: string;
  dashboardLink: string;
};
