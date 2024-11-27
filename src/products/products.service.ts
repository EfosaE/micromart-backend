import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductDTO } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { FilterOptions } from 'src/interfaces/enum';

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

  async getFilteredProducts(filterOptions: FilterOptions) {
    const { tags, minPrice, maxPrice } = filterOptions;
    console.log(filterOptions);
    const products = await this.db.product.findMany({
      where: {
        AND: [
          {
            tags: {
              hasSome: tags, // Filters products having at least one of the specified tags
            },
          },
          {
            price: {
              gte: minPrice, // Minimum price filter
            },
          },
          {
            price: {
              lte: maxPrice, // Maximum price filter
            },
          },
        ],
      },
    });

    return { length: products.length, products };
  }
}
