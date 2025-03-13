// this scrypt is to hash the password
// use during devlopment only
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function hashExistingPasswords() {
    const users = await prisma.user.findMany();
    
    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });
    }
}

hashExistingPasswords()
    .then(() => console.log('Passwords hashed'))
    .catch(console.error)
    .finally(() => prisma.$disconnect());
