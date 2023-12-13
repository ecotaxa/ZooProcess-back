// import { PrismaClient } from '@prisma/client'
const {PrismaClient} = require('@prisma/client')

exports.prisma = () => {
    return new PrismaClient()
}

// export default prisma

