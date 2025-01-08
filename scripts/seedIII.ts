import { $Enums, PrismaClient } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { computerData, phones } from './data';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);
const prisma = new PrismaClient().$extends({
  query: {
    product: {
      async create({ args, query }) {
        // Generate a random ID using nanoid
        const randomID = nanoid();
        console.log('Generated ID:', randomID);

        // Add the generated ID to the product creation arguments
        args.data.id = `PROD-${randomID}`;

        // Execute the original query with the modified arguments
        return query(args);
      },
    },
  },
});

async function main() {
  for (const productData of computerData) {
    await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        imgType: productData.imgType as $Enums.ImgType,
        imgUrl: productData.imgUrl,
        price: productData.price,
        quantity: productData.quantity,
        user: {
          connect: { id: productData.userId }, // Connect the vendor
        },
        tags: {
          connect: productData.tagIds.map((id) => ({ id })), // Connect the tag
        },
      },
    });
  }

    for (const productData of phones) {
      await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          imgType: productData.imgType as $Enums.ImgType,
          imgUrl: productData.imgUrl,
          price: productData.price,
          quantity: productData.quantity,
          user: {
            connect: { id: productData.userId }, // Connect the vendor
          },
          tags: {
            connect: productData.tagIds.map((id) => ({ id })), // Connect the tag
          },
        },
      });
    }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
