
// const subsamples = require('../../routes/subsamples');
// const { scan } = require('../../routes/background');
// const { default: NotFoundException } = require('../../exceptions/NotFoundException');
const NotFoundException = require('../../exceptions/NotFoundException');
const samples = require('../../routes/samples');


const { Prisma } = require('../client')
// const NotFoundException = require('../../exceptions/NotFoundException')

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
                    // scan: true,
                    scanSubsamples:{
                        include: {
                            subsample: true
                        }
                    }
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
                        // scan: true,
                        scanSubsamples:{
                            include: {
                                subsample: true
                            }
                        }
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

        let where;
        if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
            // It's an ObjectId
            where = { id: projectId };
        } else {
            // It's a name
            where = { name: projectId };
        }

        const project = await this.prisma.project.findFirst({
            // where:{
            //     id:projectId
            // }
            // where:{
            //     OR: [
            //         {
            //             id: projectId
            //         },
            //         {
            //             name: projectId
            //         }
            //     ]
            // }
            where
        })

        if ( project == null ) {
            console.log("project is null")
            // throw Error("Project not found")
            throw new NotFoundException("Project not found");

            // return {}
        }

        console.log("project: ", project)
        

        // if ( project.instrumentId == null ) {
        //     console.log("instrumentId is null")
        //     throw new Error("Project has no instrument assigned")
        //     // return []
        // }

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
                projectId: project.id
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
                        // scan: true,
                        scanSubsamples:{
                            include: {
                                subsample: true
                            }
                        }
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
    async add(params) {

        const {url, subsampleId, userId, instrumentId, projectId, type} = params
        console.log("Prisma Scans add")
        console.trace("Prisma Scans add")
        console.log("Scan::add")
        console.log("projectId: ", projectId)
        console.log("userId: ", userId)
        console.log("instrumentId: ", instrumentId)
        console.log("subsampleId: ", subsampleId)
        // console.log("background: ", background)
        console.log("type: ", type) 

        // let data = {
        //     url,
        //     userId,
        //     // background,
        //     instrumentId,
        //     projectId,
        //     type
        // }

        console.trace("Scan::add")

        // change field name
        // let data = params
        // // rename the field name
        // if (subsampleId != undefined) {
        //     // Take care - Need to reformat the field name subSampleId != subsampleId
        //     data['subSampleId'] = subsampleId // add new the new field
        //     data['subsampleId'] = undefined // remove the old field
        // }

        let data = params
        if (subsampleId != undefined) {
            data['subsampleId'] = undefined // remove the old field
        }


        // let scandata = {
        //     ...data,
        //     scanSubsamples:{
        //         create: [
        //             {
        //                 connect: {id : subsampleId}
        //             }
        //         ]
        //     }
        // }


        const scan = this.prisma.scan.upsert({
            where: {
                url: data.url
          },
          update: {
            ...data,
            scans: {
              create: {
                scanSubsamples: {
                  connect: { id: subsampleId }
                }
              }
            }
          },
          create: {
            ...data,
            scanSubsamples: {
              create: {
                subsample: {
                  connect: { id: subsampleId }
                }
              }
            }
          }
        })





        // const scan = this.prisma.scan.create({data})

        // need to change to upsert
        // const scan = await prisma.scan.upsert({
        //     where: { url: url },
        //     update: {
        //       subsampleScans: {
        //         create: [
        //           { subsampleId: subsampleId }
        //         ]
        //       }
        //     },
        //     create: {
        //       url: url,
        //       type: type,
        //       userId: userId,
        //       instrumentId: instrumentId,
        //       projectId: projectId,
        //       subsampleScans: {
        //         create: [
        //           { subsampleId: subsampleId }
        //         ]
        //       }
        //     }
        //   });

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

    // await this.prisma.scan.deleteMany({
    //     where: {
    //         subSampleId: subSampleID,
    //         type: {
    //             notIn: ['RAW_BACKGROUND', 'BACKGROUND']
    //         }
    //     }
    // });

    await prisma.scan.deleteMany({
        where: {
            scanSubsamples: {
                some: {
                    subsampleId: subSampleID
                }
            },
            type: {
                notIn: ['RAW_BACKGROUND', 'BACKGROUND']
            }
        }
      })
      
}


}