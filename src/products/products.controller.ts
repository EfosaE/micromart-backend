import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,

} from '@nestjs/common';

import { ProductDTO } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { AuthService } from 'src/auth/auth.service';
import { ProductQueryDto } from './dto/find-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/interfaces/types';
import { RolesGuard } from 'src/common/role.guard';
import { validateFile } from 'src/utils/file.util';
import { SkipAuth } from 'src/decorators/skip-auth';

@ApiTags('Products') // Group this controller under "Products" in Swagger
@UseGuards(RolesGuard) // Apply RolesGuard only where needed
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private authService: AuthService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @SkipAuth()
  @Get()
  getAllProducts(@Query() query: ProductQueryDto) {
    const { tags, minPrice, maxPrice, limit } = query;
    console.log(tags)
    if (tags && !minPrice && !maxPrice) {
      return this.productsService.getProductsByTags(tags, limit);
    }
    return this.productsService.getFilteredProducts(query, limit);
  }

  @SkipAuth()
  @Get('categories')
  getAllCategories() {
    return this.productsService.getAllCategories();
  }

  @SkipAuth()
  @Get('tags')
  getAllTags() {
    return this.productsService.getAllTagsGroupedByTagType();
  }

  @Post()
  @Roles(Role.ADMIN, Role.VENDOR)
  @UseInterceptors(FileInterceptor('image'))
  async createProduct(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() productDetails: ProductDTO,
    @Req() req
  ) {
    console.log(productDetails);
    const { imgUrl } = productDetails;
    const userID = this.authService.extractUserID(req);
    // Ensure at least one of file or imgUrl is provided
    if (!file && !imgUrl) {
      throw new BadRequestException('Either file or imgUrl must be provided.');
    }

    // Validate and upload file if present and no imgUrl exists
    if (file && !imgUrl) {
      validateFile(file);
      const uploadResult = await this.cloudinaryService.uploadImage(
        file,
        'micromart'
      );
      console.log(uploadResult);
      // Update productDetails with the uploaded image URL
      productDetails.imgUrl = uploadResult.secure_url;
    }

    // Ensure imgUrl is set before converting to ProductType
    const productData = {
      ...productDetails,
      imgUrl: productDetails.imgUrl,
    };

    // Create product using ProductType
    return await this.productsService.createProduct(productData, userID);
  }
}
