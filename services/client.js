// import { PrismaClient } from '@prisma/client'
const {PrismaClient} = require('@prisma/client')

module.exports.prisma = () => {
    return new PrismaClient()
}

// export default prisma

module.exports.Prisma = class {

    constructor(){
        this.client = new PrismaClient({
            log: ['query'],
        });
    }


}
