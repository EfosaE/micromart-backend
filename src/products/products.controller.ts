import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ProductDTO } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private authService: AuthService
  ) {}

  @Post()
  createProduct(@Req() req, @Body() productDetails: ProductDTO) {

    // Extract userId from the token by calling authService
    const userID = this.authService.extractUserID(req);
    console.log('userID...', userID)
    return this.productsService.createProduct(productDetails, userID);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }
}
