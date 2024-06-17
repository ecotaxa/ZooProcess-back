
// const {PrismaClient} = require('@prisma/client')
// const { prisma } = require('@/services/client')
const { Prisma } = require('../client')

// const prisma = new PrismaClient();

module.exports.Drives = class {

    constructor() {
        // this.prisma = new PrismaClient()
        this.prisma = new Prisma().client;
        // this.prisma = prisma;
      } 

      async findAll() {
        const drives = await this.prisma.drive.findMany({
                orderBy:{
                    name: 'asc'
                }
        })
        return drives
    }

    async get(driveId) {
        const drive = await this.prisma.drive.findMany({
            where:{
                id:driveId
            }
        })
        return drive
    }

    // async findDrive({params}){
    //     return this.getDrive(params.id) 
    //     .then(res => {
    //         console.log("rrrr",res) 
    //         return res
    //     })
    //     .catch (async (e) => {
    //         console.error(e)
    //         throw(e)
    //     })
    // }


    async add(data) {
        console.log("Prisma Drives add")
        const drive = this.prisma.drive.create({data:data})
        return drive
    }

}
