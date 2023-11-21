
const {PrismaClient} = require('@prisma/client')
const Service = require('./Service')

module.exports.Drives = class {

    constructor() {
        this.prisma = new PrismaClient()
      } 

      async findAll() {
        const drives = await this.prisma.drive.findMany({})
        return drives
    }

    //   async findAll({}){
    //     return this.get() 
    //     .then(res => {
    //         console.log("rrrr",res) 
    //         // this.prisma.$disconnect()
    //         return res
    //     })
    //     .catch (async (e) => {
    //         // this.prisma.$disconnect()
    //         console.error(e)
    //         throw(e)
    //     })
    // }

    async getDrive(driveid) {
        const drives = await this.prisma.drive.findMany({
            where:{
                id:driveid
            }
        })
        return drives
    }

    async findDrive({params}){
        return this.getDrive(params.id) 
        .then(res => {
            console.log("rrrr",res) 
            // this.prisma.$disconnect()
            return res
        })
        .catch (async (e) => {
            // this.prisma.$disconnect()
            console.error(e)
            throw(e)
        })
    }


    async add(data) {
        const drive = this.prisma.drive.create({data:data})
        return drive
    }

    // async create(body){
  
    //     console.log("Drives::create", body)
  
    //     return this.add(body)
    //     .then(res => {
    //         console.log("rrrr", res) 
    //         // this.prisma.$disconnect()
    //         return res
    //     })
    //     .catch(async(e) => {
    //         // this.prisma.$disconnect()
    //         console.error("Error:",e)
    //         throw(e)
    //         Service.rejectResponse(e,500)
    //     })
    // }

}
