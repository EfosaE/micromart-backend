import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductDTO } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';

@Injectable()
export class ProductsService {
  constructor(
    private db: DatabaseService,
    private readonly logger: MyLoggerService
  ) {}
  async createProduct(product: ProductDTO) {
    const newProduct = await this.db.product.create({
      data: { ...product },
    });
    return newProduct;
  }
}
