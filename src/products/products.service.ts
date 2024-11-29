import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductDTO } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { FilterOptions } from 'src/interfaces/types';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: MyLoggerService,
    private db: DatabaseService
  ) {}
  async createProduct(product: ProductDTO, userID: string) {
    const newProduct = await this.db.product.create({
      data: {
        ...product,
        user: {
          connect: { id: userID }, // Automatically link the product to the user(seller)
        },
      },
    });

    return newProduct;
  }
  async getProductByID(productId: string) {
    const product = await this.db.product.findUnique({
      where: {
        id: productId,
      },
    });

    return product;
  }

  async updateProduct(productId: string, quantityOrdered: number) {
      const updatedProduct = await this.db.product.update({
        where: { id: productId },
        data: {
          quantity: {
            decrement: quantityOrdered, // Atomically decrement the quantity
          },
        },
      });

      if (updatedProduct.quantity < 0) {
        throw new Error('Insufficient stock available');
      }

      return updatedProduct;
  }

  async getFilteredProducts(filterOptions: FilterOptions) {
    const { tags, minPrice, maxPrice } = filterOptions;
    console.log(filterOptions);
    const products = await this.db.product.findMany({
      where: {
        AND: [
          tags && tags.length > 0
            ? {
                tags: {
                  hasSome: tags, // Filters products having at least one of the specified tags
                },
              }
            : undefined,
          minPrice
            ? {
                price: {
                  gte: minPrice, // Minimum price filter
                },
              }
            : undefined,
          maxPrice
            ? {
                price: {
                  lte: maxPrice, // Maximum price filter
                },
              }
            : undefined,
        ].filter(Boolean),
      },
    });

    return { length: products.length, products };
  }
}
