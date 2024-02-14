
const { Prisma } = require('../client')


module.exports.Scans = class {

    constructor() {
        this.prisma = new Prisma().client;
      } 

      async findAll({background /*:boolean*/}) {

        console.log("Prisma Scans findAll")

        // return []

        const scans = await this.prisma.scan.findMany({
            where:{
                background,
            }
        //   include:{
        //         background,
        //         // project: {
        //         //     include:{
        //         //         drive: true,
        //         //         ecotaxa: true,
        //         //         samples: true,
        //         //     }
        //         // }
        //     }
        })
        return scans
    }

    async add({url, background, subsampleId, userId, instrumentId}) {

        console.log("Prisma Scans add")
        console.log("Scan::add")
        console.log("background: ", background)
        console.log("instrumentId: ", instrumentId)
        console.log("userId: ", userId)

        let data = {
            url,
            userId,
            background,
            instrumentId
        }

        if (subsampleId != undefined) {
            data['sample'] = subsampleId
        }      

        const scan = this.prisma.scan.create({data})
        return scan
    }

}