const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = bcrypt.hashSync('docker1234', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@invalid.com' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@invalid.com', 
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
}

createAdmin()
  .then(() => console.log('Admin user created'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());

