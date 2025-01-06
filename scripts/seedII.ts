import { $Enums, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productTags = {
  GeneralProductTags: [
    'New Arrival',
    'On Sale',
    'Limited Edition',
    'Exclusive',
    'Pre-order',
    'Clearance',
    'Bundle Offer',
    'Flash Deal',
    "Editor's Pick",
  ],
  AdminTags: [
    'Best Seller',
    'Trending',
    'Back in Stock',
    'Out of Stock',
    'Top Rated',
    'Featured Product',
    'Black Friday',
    'Cyber Monday',
    'Holiday Special',
    'Winter Sale',
    'Summer Sale',
    'Christmas Deals',
    "Valentine's Day Specials",
    'Back to School Deals',
    'Easter Specials',
  ],
  SeasonalTags: ['Rainy Collection', 'Summer Collection'],
  CategoryBasedTags: [
    'Clothing',
    'Shoes & Footwear',
    'Bags',
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Books',
    'Health & Wellness',
    'Groceries',
    'Automotive',
    'Office Supplies',
    'Jewelry & Accessories',
    'Appliances',
    'Furniture',
    'Pet Supplies',
    'Services',
    'Tools',
  ],
  ConditionBasedTags: [
    'New',
    'Refurbished',
    'Used',
    'Certified Pre-Owned',
    'Open Box',
    'Damaged',
  ],
  PriceBasedTags: [
    'Budget-Friendly',
    'Premium',
    'Luxury',
    'Discounted',
    'Free Delivery',
  ],
  UsageBasedTags: [
    'Eco-Friendly',
    'Handmade',
    'Customizable',
    'Giftable',
    'Multi-Pack',
    'Portable',
    'Rechargeable',
    'DIY Kit',
    'Weather Resistant',
    'Compact Design',
  ],
  DemographicTags: [
    'Men',
    'Women',
    'Kids',
    'Unisex',
    'Teens',
    'Baby Essentials',
    'Senior Friendly',
  ],
  MaterialQualityTags: [
    'Organic',
    'Vegan',
    'Sustainable',
    'Durable',
    'Lightweight',
    'Waterproof',
    'BPA-Free',
    'Recyclable',
    'Hypoallergenic',
    'Rust Resistant',
  ],
  FunctionalTags: [
    'Smart',
    'Bluetooth Enabled',
    'Wireless',
    'Energy Efficient',
    'Plug & Play',
    'Multi-Functional',
    'Ergonomic',
  ],
  Others: [],
};

async function main() {
  for (const [tagType, tags] of Object.entries(productTags)) {
    for (const tag of tags) {
      await prisma.tag.upsert({
        where: {
          name_tagType: { name: tag, tagType: tagType as $Enums.TagType },
        },
        update: {},
        create: {
          name: tag,
          tagType: tagType as $Enums.TagType,
        },
      });
      console.log(`Seeded tag: ${tag} under type: ${tagType}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seeding complete!');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
