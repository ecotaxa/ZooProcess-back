
// const subsamples = require('../../routes/subsamples');
// const { scan } = require('../../routes/background');
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
                // background,
                type: "BACKGROUND",
                // instrumentId
            },
          include:{
        //         background,
        //         // project: {
        //         //     include:{
        //         //         drive: true,
        //         //         ecotaxa: true,
        //         //         samples: true,
        //         //     }
        //         // }
            // SubSample: true
            SubSample: {
                include: {
                    scan: true,
                }
            }
        }
        })
        return scans
    }


    async findScan( {scanId }) {
        console.log("Prisma Scans findScan" , scanId)

        if (scanId == undefined ) throw "No scanId provided" //new Error({message:"No scanId provided"})

        const scan = await this.prisma.scan.findFirstOrThrow({
            where: {
                id: scanId
            },
            include: {
                // SubSample: true
                SubSample: {
                include: {
                        scan: true,
                    }
                }
            }
        })

        return scan
    }

    async findAllFromProject( {background /*:boolean*/, projectId} ) {

        console.log("Prisma Scans findAllBackground " , background)
        // console.log("Prisma Scans findAll - background: ", background)
        console.log("Prisma Scans findAllBackground - projectId:", projectId)

        const project = await this.prisma.project.findFirst({
            where:{
                id:projectId
            }
        })

        if ( project == null ) {
            console.log("project is null")
            throw Error("Project not found")
            // return {}
        }

        console.log("project: ", project)

        if ( project.instrumentId == null ) {
            console.log("instrumentId is null")
            throw new Error("Project has no instrument assigned")
            // return []
        }

        // let where = {
        //     background: background,
        //     instrumentId: project.instrumentId
        // }
        // if ( project.instrumentId ){
        //     where.instrumentId = project.instrumentId
        // } 

        const scans = await this.prisma.scan.findMany({
            where: {
                background: background,
                instrumentId: project.instrumentId
            },
            include:{
                instrument: true,
                // SubSample: true,
                SubSample: {
                    include: {
                        // user: true,
                        // user: false,
                        metadata: true,
                        qc: true ,
                        // qc: {
                        //     include: {
                        //         // state : true
                        //     }
                        // }
                        scan: true
                    }
                },
                user: true
            },
            // allowNull: true,
            orderBy:{
                createdAt: 'desc'
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


    // async add({url, background, subsampleId, userId, instrumentId, projectId, type}) {
    async add({url, subsampleId, userId, instrumentId, projectId, type}) {

        console.log("Prisma Scans add")
        console.log("Scan::add")
        console.log("projectId: ", projectId)
        console.log("userId: ", userId)
        console.log("instrumentId: ", instrumentId)
        console.log("subsampleId: ", subsampleId)
        // console.log("background: ", background)
        console.log("type: ", type) 

        let data = {
            url,
            userId,
            // background,
            instrumentId,
            projectId,
            type
        }

        if (subsampleId != undefined) {
            // data['sample'] = subsampleId
            data['subSampleId'] = subsampleId
        }      

        const scan = this.prisma.scan.create({data})
        return scan
    }

    // async deleteAll(subSampleID){

    //     console.debug("Scans deleteAll TODO")

    //     const scans = await this.prisma.scan.findMany({
    //         where: {
    //             subSampleId: subSampleID
    //         }

    //     })

    //     scans.forEach(scan => {

    //         console.debug("scan to remove : ", scan.id)
    //     //     // if ( scan.type != Prisma.ScanType.RAW_BACKGROUND && scan.type != Prisma.ScanType.RAW_BACKGROUND ) {
    //     //         this.prisma.scan.delete({
    //     //             where: {
    //     //                 id: scan.id,
    //     //                 type: this.prisma.scanType.RAW_BACKGROUND
    //     //             }
    //     //         })

    //     //     // } else {
    //     //     //     console.debug
    //     //     //     ("Not deleting scan: ", scan.id)
    //     //     // }

    //     //     this.prisma.scan.delete({
    //     //         where: {
    //     //             id: scan.id
    //     //         }
    //     //     })
            
    //     // });
    // }
// }

async deleteAll(subSampleID) {
    console.debug("Scans deleteAll")

    await this.prisma.scan.deleteMany({
        where: {
            subSampleId: subSampleID,
            type: {
                notIn: ['RAW_BACKGROUND', 'BACKGROUND']
            }
        }
    });
}


}