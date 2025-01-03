import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductType } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { $Enums } from '@prisma/client';
import { FilterOptions } from 'src/interfaces/types';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: MyLoggerService,
    private db: DatabaseService
  ) {}
  async createProduct(product: ProductType, userID: string) {
    const { tags } = product;
    const createdTags = await this.createTags(tags);

    const newProduct = await this.db.product.create({
      data: {
        ...product,
        user: {
          connect: { id: userID }, //  link the product to the user(vendor or admin)
        },
        tags: {
          connect: createdTags.map((tag) => ({ id: tag.id })),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    this.logger.log(
      `product:${newProduct.id} created by ${userID} `,
      ProductsService.name
    );
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

  async getFilteredProducts(filterOptions: FilterOptions) {
    const { tags, minPrice, maxPrice } = filterOptions;
    console.log(filterOptions);
    const products = await this.db.product.findMany({
      where: {
        AND: [
          tags && tags.length > 0
            ? {
                tags: {
                  some: {
                    name: {
                      in: tags,
                    },
                  },
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
      select: {
        id: true,
        name: true,
        imgUrl: true,
        price: true,
        quantity: true,
      },
    });

    return { length: products.length, products };
  }

  async getProductsByTags(tags: string[]) {
    const products = await this.db.product.findMany({
      where: {
        tags: {
          some: {
            name: {
              in: tags,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        imgUrl: true,
        price: true,
        quantity: true,
      },
    });

    return { length: products.length, tags, products };
  }

  async createTags(tags: { name: string; tagType: string }[]) {
    const tagPromises = tags.map(async ({ name, tagType }) => {
      // Ensure the tagType is valid, or you may need to map it to an enum
      if (!Object.values($Enums.TagType).includes(tagType as $Enums.TagType)) {
        throw new BadRequestException(`Invalid tagType: ${tagType}`);
      }

      // Create or ensure the tag exists
      const tag = await this.db.tag.upsert({
        where: {
          name_tagType: {
            name,
            tagType: tagType as $Enums.TagType,
          },
        },

        update: {}, // No need to update anything, just check for existence
        create: {
          name,
          tagType: tagType as $Enums.TagType, // Ensure tagType is valid
        },
      });

      return tag;
    }); // Wait for all tag creation promises to resolve
    return await Promise.all(tagPromises);
  }
}
