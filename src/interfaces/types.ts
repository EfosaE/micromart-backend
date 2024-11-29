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

// export interface OrderItem {
//   productId: string;
//   orderId: string;
//   quantity: number;
//   price: number;
//   order?: Order; // Optional relation to Order
//   product?: Product; // Optional relation to Product
// }


// export interface Order {
//   id: string;
//   totalAmount: number;
//   buyerId: string;
//   orderItems?: OrderItem[]; // Optional relation to OrderItems
// }

// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   description?: string; // Optional field
//   // Add other fields from your Product schema
// }
