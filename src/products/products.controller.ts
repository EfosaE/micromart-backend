import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductDTO } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() productDetails: ProductDTO) {
    return this.productsService.createProduct(productDetails);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }
}
