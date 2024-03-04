
const { Prisma } = require('../client')


module.exports.Scans = class {

    constructor() {
        this.prisma = new Prisma().client;
      } 

      async findAll({background /*:boolean*/, instrumentId}) {

        console.log("Prisma Scans findAll")
        console.log("Prisma Scans findAll - background: ", background)
        console.log("Prisma Scans findAll - instrumentId:", instrumentId)

        // return []

        const scans = await this.prisma.scan.findMany({
            where:{
                background,
                // instrumentId
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

    async findAllFromProject( {background /*:boolean*/, projectId} ) {

        console.log("Prisma Scans findAllBackground")
        // console.log("Prisma Scans findAll - background: ", background)
        console.log("Prisma Scans findAllBackground - projectId:", projectId)

        const project = await this.prisma.project.findFirst({
            where:{
                id:projectId
            }
        })

        if ( project == null ) {
            console.log("project is null")
            throw "Project not found"
        }

        console.log("project: ", project)

        if ( project.instrumentId == null ) {
            console.log("instrumentId is null")
            throw new Error("Project has no instrument assigned")
        }

        const scans = await this.prisma.scan.findMany({
            where:{
                background: background,
                instrumentId: project.instrumentId
            },
            include:{
                instrument: true,
                user: true
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