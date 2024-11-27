import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ProductDTO } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { AuthService } from 'src/auth/auth.service';
// import { FilterOptions } from 'src/interfaces/enum';
import { ProductQueryDto } from './dto/find-product.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Products') // Group this controller under "Products" in Swagger
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
    console.log('userID...', userID);
    return this.productsService.createProduct(productDetails, userID);
  }

  @Get()
  getAllProducts(@Query() query: ProductQueryDto) {
    return this.productsService.getFilteredProducts(query);
  }
}
