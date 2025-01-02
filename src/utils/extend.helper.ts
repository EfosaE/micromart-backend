import { customAlphabet } from 'nanoid';


const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

import { INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { withOptimize } from '@prisma/extension-optimize';

function extendPrismaClient() {
  const prisma = new PrismaClient({
    log: ['info'],
  });
  // const logger = new MyLoggerService();
  return prisma
    .$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY }))
    .$extends({
      client: {
        async onModuleInit() {
          await Prisma.getExtensionContext(this)
            .$connect()
            .then(() => console.log('database connected'));
        },
        async enableShutdownHooks(app: INestApplication) {
          Prisma.getExtensionContext(this).$on('beforeExit', async () => {
            await app.close();
          });
        },
      },
      query: {
        // Global extension for all models and operations
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            console.log(
              `Connection taken for operation: ${operation} on ${model}`
            );
            const start = performance.now();
            const result = await query(args);
            const end = performance.now();
            const time = end - start;
            // logger.debug(`${model}.${operation} took ${time.toFixed(2)}ms`);
            console.log(
              `Connection released for operation: ${operation} on ${model} in ${time.toFixed(2)}ms `
            );
            return result;
          },
        },
        product: {
          async create({ args, query }) {
            const randomID = nanoid();
            console.log('Generated ID:', randomID); // Log the generated ID
            args.data.id = `PROD-${randomID}`; // Modify the product creation args with the new ID

            return query(args); // Continue with the original query
          },
        },
        order: {
          async create({ args, query }) {
            const randomID = nanoid();
            console.log('Generated ID:', randomID); // Log the generated ID
            args.data.id = `ORD-${randomID}`; // Modify the order creation args with the new ID

            return query(args); // Continue with the original query
          },
        },
      },
    });
}

export const ExtendedPrismaClient = class {
  constructor() {
    return extendPrismaClient();
  }
} as new () => ReturnType<typeof extendPrismaClient>;
