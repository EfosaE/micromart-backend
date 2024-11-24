import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductDTO } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: MyLoggerService,
    private db: DatabaseService
  ) {}
  async createProduct(product: ProductDTO) {
    // prisma has a funny foerien key type error on build
    const productData: Prisma.ProductUncheckedCreateInput = {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      tags: product.tags,
      userId: product.userId, // Ensure ProductDTO has userId as a string
    };

    const newProduct = await this.db.product.create({
      data: productData,
    });

    return newProduct;
  }

  async getAllProducts() {
    const products = await this.db.product.findMany();
    return products;
  }
}
