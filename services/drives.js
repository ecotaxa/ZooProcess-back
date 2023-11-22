
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
        const drive = this.prisma.drive.create({data:data})
        return drive
    }

}
