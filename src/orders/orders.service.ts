import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { MyLoggerService } from 'src/logger/logger.service';
import { ProductsService } from 'src/products/products.service';
import { Product } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from './events/order-created.event';

@Injectable()
export class OrdersService {
  constructor(
    private db: DatabaseService,
    private logger: MyLoggerService,
    private readonly eventEmitter: EventEmitter2,
    private readonly productsService: ProductsService
  ) {}
  async createOrder(buyerId: string, orderInfo: CreateOrderDto) {
    console.log(orderInfo);

    // const products = await this.getProductsFromOrder(orderInfo);
    // console.log('products array', products);
    // // Ensure all products exist
    // if (products.some((product) => !product)) {
    //   throw new Error('One or more products in the order do not exist');
    // }

    //  Calculate total amount and prepare order items to ensure we have the quantity in supply
    const orderItems = await this.validateOrder(orderInfo);
    console.log('modified orderItems', orderItems);
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Remove the 'price' property from each object because the order doesnt need it.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedOrderItems = orderItems.map(({ price, ...rest }) => rest);

    // Step 4: Create the order
    const order = await this.db.order.create({
      data: {
        totalAmount,
        shippingDetails: orderInfo.shippingDetails,
        user: {
          connect: { id: buyerId }, // Associate using the User's ID
        },
        orderItems: {
          create: updatedOrderItems, // Create related order items in a single transaction
        },
      },
      include: {
        orderItems: true, // Optionally include the order items in the response
      },
    });

    // Emit the event after order creation
    this.eventEmitter.emit(
      'order.created', // Event name
      new OrderCreatedEvent(order.id) // Payload, using class so I can get Type checks
    );
    return order;
  }

  private async getProductsFromOrder(
    order: CreateOrderDto
  ): Promise<Product[]> {
    const productIds = order.orderItems.map((item) => item.productId);
    // Fetch the products by their IDs
    const products = await Promise.all(
      productIds.map((productId) =>
        this.productsService.getProductByID(productId)
      )
    );
    return products;
  }

  private async validateOrder(orderInfo: CreateOrderDto) {
     const orderItems = await Promise.all(
       orderInfo.orderItems.map(async (item) => {
         const product = await this.productsService.updateProduct(
           item.productId,
           item.quantity
         );
         return {
           productId: item.productId,
           quantity: item.quantity,
           price: product.price, // This will now be resolved
         };
       })
     );
     return orderItems;
  }
  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto);
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
