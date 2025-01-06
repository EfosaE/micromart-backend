import { $Enums, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const productsData = [
    {
      name: 'Luxury Leather Bag',
      description: 'A high-quality, handcrafted leather bag for professionals.',
      imgType: 'URL',
      imgUrl: 'https://example.com/images/leather-bag.jpeg',
      price: 120000,
      quantity: 15,
      userId: '10d12c2b-930c-473e-b12b-37e3bc8dd945', // Replace with actual vendor ID
      tagIds: [1, 3, 6],
    },
    {
      name: 'Wireless Earbuds',
      description: 'Compact and ergonomic earbuds with superior sound quality.',
      imgType: 'URL',
      imgUrl: 'https://example.com/images/earbuds.jpeg',
      price: 30000,
      quantity: 50,
      userId: '10d12c2b-930c-473e-b12b-37e3bc8dd945',
      tagIds: [87, 91, 85],
    },
  ];

  for (const productData of productsData) {
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
