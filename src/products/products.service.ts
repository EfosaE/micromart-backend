import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductType } from './dto/create-product.dto';
import { MyLoggerService } from 'src/logger/logger.service';
import { FilterOptions } from 'src/interfaces/types';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: MyLoggerService,
    private db: DatabaseService
  ) {}
  async createProduct(product: ProductType, userID: string) {
    const newProduct = await this.db.product.create({
      data: {
        ...product,
        user: {
          connect: { id: userID }, //  link the product to the user(vendor or admin)
        },
        tags: {
          connect: product.tags.map((tagId) => ({ id: tagId })),
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
        imgUrl: true,
        name: true,
      },
    });

    return product;
  }

  async getFilteredProducts(filterOptions: FilterOptions, limit:number) {
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
        tags: true,
      },
      take: limit,
    });

    return { length: products.length, products };
  }

  async getProductsByTags(tags: string[], limit: number) {
    const products = await this.db.product.findMany({
      where: {
        tags: {
          some: {
            name: {
              in: tags,
              mode: 'insensitive',
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
      take: limit, // Limit the number of products to 4
    });

    return { length: products.length, tags, products };
  }

  // getAllTags = async () => {
  //   const tags = await this.db.tag.findMany();
  //   return tags;
  // };
  getAllTagsGroupedByTagType = async () => {
    const tags = await this.db.tag.findMany(); // Fetch all tags

    // Group tags by tagType
    const groupedTags = tags.reduce((result, tag) => {
      const { tagType, id, name } = tag;
      if (!result[tagType]) {
        result[tagType] = [];
      }
      result[tagType].push({ id, name });
      return result;
    }, {});
    return groupedTags;
  };

  async getAllCategories() {
    const categories = await this.db.category.findMany({
      orderBy: { id: 'asc' }, // Ordering by the 'id' field in ascending order
    });
    console.log(categories);
    return categories;
  }
}
