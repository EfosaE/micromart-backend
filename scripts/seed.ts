import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  'Fashion',
  'Electronics',
  'Home & Furniture',
  'Beauty & Personal Care',
  'Sports, Fitness & Outdoors',
  'Toys & Games',
  'Books',
  'Health & Wellness',
  'Automotive',
  'Music',
  'Movies & TV',
  'Grocery',
  'Pet Supplies',
  'Office Supplies',
  'Baby Products',
  'Food & Beverages',
  'Tools & Home Improvement',
  'Arts & Crafts',
  'Garden & Outdoor',
  'Computers & Accessories',
  'Cell Phones & Accessories',
  'Appliances',
  'Jewelry & Watches',
  'Luggage & Travel Gear',
  'Video Games',
  'Collectibles & Fine Art',
  'Handmade Products',
  'Office Furniture',
  'Shoes & Bags',
  'Photography & Camera',
];

async function main() {
  const categoryData = categories.map((category) => ({
    name: category,
  }));

  // Using createMany for bulk insertion
  await prisma.category.createMany({
    data: categoryData,
  });

  console.log(`Successfully created ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
