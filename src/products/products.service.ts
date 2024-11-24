import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductDTO } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';


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
          connect: { id: userID }, // Automatically link the product to the user
        },
      },
    });

    return newProduct;
  }

  async getAllProducts() {
    const products = await this.db.product.findMany();
    return products;
  }
}
