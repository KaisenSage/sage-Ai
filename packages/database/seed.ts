import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a sample business
  const business = await prisma.business.create({
    data: {
      name: 'Sage Coffee & Bistro',
      slug: 'sage-coffee-bistro',
      email: 'hello@sagecoffee.com',
      phone: '+1234567890',
      settings: {
        timezone: 'UTC',
        currency: 'USD',
        taxRate: 0.08,
      },
    },
  });

  console.log('✅ Created business:', business.name);

  // Create staff/admin user
  const passwordHash = await bcrypt.hash('password123', 10);
  const staff = await prisma.staff.create({
    data: {
      businessId: business.id,
      email: 'admin@sagecoffee.com',
      passwordHash,
      name: 'Admin User',
      phone: '+1234567891',
      role: 'OWNER',
      isActive: true,
    },
  });

  console.log('✅ Created staff user:', staff.email);
  console.log('   Password: password123');

  // Create two branches
  const branch1 = await prisma.branch.create({
    data: {
      businessId: business.id,
      name: 'Downtown Branch',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      phone: '+1234567892',
      email: 'downtown@sagecoffee.com',
      isActive: true,
      orderingEnabled: true,
      coordinates: { lat: 37.7749, lng: -122.4194 },
      settings: {
        openingHours: {
          monday: { open: '07:00', close: '20:00' },
          tuesday: { open: '07:00', close: '20:00' },
          wednesday: { open: '07:00', close: '20:00' },
          thursday: { open: '07:00', close: '20:00' },
          friday: { open: '07:00', close: '21:00' },
          saturday: { open: '08:00', close: '21:00' },
          sunday: { open: '08:00', close: '19:00' },
        },
      },
    },
  });

  const branch2 = await prisma.branch.create({
    data: {
      businessId: business.id,
      name: 'Airport Branch',
      address: '456 Airport Blvd',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      phone: '+1234567893',
      email: 'airport@sagecoffee.com',
      isActive: true,
      orderingEnabled: true,
      coordinates: { lat: 37.6213, lng: -122.3790 },
      settings: {
        openingHours: {
          monday: { open: '05:00', close: '22:00' },
          tuesday: { open: '05:00', close: '22:00' },
          wednesday: { open: '05:00', close: '22:00' },
          thursday: { open: '05:00', close: '22:00' },
          friday: { open: '05:00', close: '22:00' },
          saturday: { open: '05:00', close: '22:00' },
          sunday: { open: '05:00', close: '22:00' },
        },
      },
    },
  });

  console.log('✅ Created branches:', branch1.name, 'and', branch2.name);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'Coffee',
        description: 'Hot and iced coffee beverages',
        order: 1,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'Pastries',
        description: 'Fresh baked goods',
        order: 2,
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        businessId: business.id,
        name: 'Sandwiches',
        description: 'Lunch sandwiches and wraps',
        order: 3,
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Created', categories.length, 'categories');

  // Create products
  const products = [
    // Coffee products
    {
      categoryId: categories[0].id,
      name: 'Espresso',
      description: 'Single shot of rich, bold espresso',
      basePrice: 2.50,
      preparationTime: 3,
    },
    {
      categoryId: categories[0].id,
      name: 'Cappuccino',
      description: 'Espresso with steamed milk and foam',
      basePrice: 4.50,
      preparationTime: 5,
    },
    {
      categoryId: categories[0].id,
      name: 'Latte',
      description: 'Espresso with steamed milk',
      basePrice: 4.75,
      preparationTime: 5,
    },
    {
      categoryId: categories[0].id,
      name: 'Cold Brew',
      description: 'Smooth cold brewed coffee',
      basePrice: 4.00,
      preparationTime: 2,
    },
    // Pastries
    {
      categoryId: categories[1].id,
      name: 'Croissant',
      description: 'Buttery, flaky pastry',
      basePrice: 3.50,
      preparationTime: 2,
    },
    {
      categoryId: categories[1].id,
      name: 'Blueberry Muffin',
      description: 'Fresh baked muffin with blueberries',
      basePrice: 3.75,
      preparationTime: 2,
    },
    {
      categoryId: categories[1].id,
      name: 'Chocolate Chip Cookie',
      description: 'Warm, gooey chocolate chip cookie',
      basePrice: 2.50,
      preparationTime: 1,
    },
    // Sandwiches
    {
      categoryId: categories[2].id,
      name: 'Turkey & Avocado Sandwich',
      description: 'Turkey, avocado, lettuce, tomato on whole grain',
      basePrice: 8.50,
      preparationTime: 7,
    },
    {
      categoryId: categories[2].id,
      name: 'Caprese Panini',
      description: 'Mozzarella, tomato, basil, balsamic on ciabatta',
      basePrice: 7.50,
      preparationTime: 8,
    },
    {
      categoryId: categories[2].id,
      name: 'Chicken Caesar Wrap',
      description: 'Grilled chicken, romaine, parmesan, caesar dressing',
      basePrice: 8.00,
      preparationTime: 6,
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        businessId: business.id,
        ...productData,
        isAvailable: true,
      },
    });

    // Add variants for coffee products
    if (productData.categoryId === categories[0].id && productData.name !== 'Espresso') {
      await Promise.all([
        prisma.productVariant.create({
          data: {
            productId: product.id,
            name: 'Small (12oz)',
            priceModifier: 0,
            isAvailable: true,
          },
        }),
        prisma.productVariant.create({
          data: {
            productId: product.id,
            name: 'Medium (16oz)',
            priceModifier: 0.75,
            isAvailable: true,
          },
        }),
        prisma.productVariant.create({
          data: {
            productId: product.id,
            name: 'Large (20oz)',
            priceModifier: 1.25,
            isAvailable: true,
          },
        }),
      ]);

      // Add addons for coffee
      await Promise.all([
        prisma.addon.create({
          data: {
            productId: product.id,
            name: 'Extra Shot',
            price: 0.75,
            isRequired: false,
            maxQuantity: 3,
          },
        }),
        prisma.addon.create({
          data: {
            productId: product.id,
            name: 'Vanilla Syrup',
            price: 0.50,
            isRequired: false,
            maxQuantity: 2,
          },
        }),
        prisma.addon.create({
          data: {
            productId: product.id,
            name: 'Caramel Syrup',
            price: 0.50,
            isRequired: false,
            maxQuantity: 2,
          },
        }),
        prisma.addon.create({
          data: {
            productId: product.id,
            name: 'Oat Milk',
            price: 0.75,
            isRequired: false,
            maxQuantity: 1,
          },
        }),
      ]);
    }
  }

  console.log('✅ Created 10 products with variants and addons');

  // Create a sample customer
  const customerPasswordHash = await bcrypt.hash('customer123', 10);
  const customer = await prisma.customer.create({
    data: {
      email: 'customer@example.com',
      phone: '+1234567894',
      name: 'John Doe',
      passwordHash: customerPasswordHash,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  console.log('✅ Created sample customer:', customer.email);
  console.log('   Password: customer123');

  // Create a sample discount
  const discount = await prisma.discount.create({
    data: {
      businessId: business.id,
      code: 'WELCOME10',
      description: '10% off your first order',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderAmount: 5,
      maxDiscountAmount: 10,
      isActive: true,
      usageLimit: 100,
    },
  });

  console.log('✅ Created discount code:', discount.code);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@sagecoffee.com / password123');
  console.log('   Customer: customer@example.com / customer123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
