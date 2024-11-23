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
  async createProduct(product: ProductDTO) {
    const newProduct = await this.db.product.create({
      data: { ...product },
    });
    return newProduct;
  }

  async getAllProducts() {
    const products = await this.db.product.findMany();
    return products;
  }
}
