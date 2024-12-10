import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DatabaseService } from 'src/database/database.service';
import { MyLoggerService } from 'src/logger/logger.service';
import { ProductsService } from 'src/products/products.service';
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
    // Step 1: Fetch all products needed for the order in a single query
    const productIds = orderInfo.orderItems.map((item) => item.productId);

    const products = await this.db.product.findMany({
      where: { id: { in: productIds } },
    });

    // Create a map for quick lookup by productId
    const productMap = new Map(products.map((p) => [p.id, p]));

    console.log(productMap);

    return await this.db.$transaction(async (trx) => {
      // Step 1: Update the stock for each order item
      const updatePromises = orderInfo.orderItems.map(async (item) => {
        const product = productMap.get(item.productId);

        if (!product || product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        // reduce the qty in stock
        await trx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity, // Atomically decrement stock
            },
          },
        });

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // This will now be resolved
        };
      });

      // Wait for all updates to finish
      const validatedOrderItems = await Promise.all(updatePromises);
      const totalAmount = validatedOrderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      // Step 2: Create the order (this step only happens if stock updates succeed)
      const createdOrder = await trx.order.create({
        data: {
          totalAmount,
          shippingDetails: orderInfo.shippingDetails,
          user: {
            connect: { id: buyerId }, // Associate using the User's ID
          },
          orderItems: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            create: validatedOrderItems.map(({ price, ...rest }) => rest),
          },
        },
        include: {
          orderItems: true, // Optionally include the order items in the response
        },
      });
      // Emit the event after order creation
      this.eventEmitter.emit(
        'order.created', // Event name
        new OrderCreatedEvent(createdOrder.id) // Payload, using class so I can get Type checks
      );
      // Step 3: Return the created order
      return createdOrder;
    });
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
