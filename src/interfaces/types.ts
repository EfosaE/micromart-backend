export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

export interface TokenPayload {
  id: string;
  name: string;
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
}

