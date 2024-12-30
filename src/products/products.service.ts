import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {  ProductType } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { FilterOptions } from 'src/interfaces/types';


@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: MyLoggerService,
    private db: DatabaseService
  ) {}
  async createProduct(product: ProductType, userID: string) {
    const newProduct = await this.db.product.create({
      data: {
        ...product,
        user: {
          connect: { id: userID }, //  link the product to the user(seller or admin)
        },
      },
    });
    this.logger.log(`product:${newProduct.id} created by ${userID} `, ProductsService.name);
    return newProduct;
  }
  async getProductByID(productId: string) {
    const product = await this.db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        price: true,
        quantity: true,
      },
    });

    return product;
  }

  // async decrementProductQty(productId: string, quantityOrdered: number, trx: unknown) {
  //   // Step 1: Update the stock for each order item
  //     const updatedProduct = await prisma.product.updateMany({
  //       where: {
  //         id: item.productId,
  //         quantity: { gte: item.quantity }, // Ensure sufficient stock
  //       },
  //       data: {
  //         quantity: {
  //           decrement: item.quantity, // Atomically decrement stock
  //         },
  //       },
  //     });

  //     // Check if the update was successful
  //     if (updatedProduct.count === 0) {
  //       throw new Error(`Insufficient stock for product ${item.productId}`);
  //     }

  // }

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
