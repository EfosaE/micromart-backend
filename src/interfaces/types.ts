import { $Enums } from '@prisma/client';

export enum Role {
  USER = 'USER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
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

export interface User {
  name: string;
  email: string;
  password: string;
  role?: 'USER';
}



export interface Vendor {
  name: string;
  email: string;
  password: string;
  role: 'VENDOR'; // Ensure that the role is explicitly 'VENDOR' for a vendor
  categoryId: number;
  businessName?: string;
}
export type PayStackResponse = {
  status: boolean,
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
}
