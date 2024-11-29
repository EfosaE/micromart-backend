import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);


import { INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

function extendPrismaClient() {
  const prisma = new PrismaClient();
  return prisma.$extends({
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
      product: {
        async findMany({ args, query }) {
          console.log('findMany extension triggered');
          return query(args);
        },

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

