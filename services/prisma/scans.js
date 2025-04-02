
// const subsamples = require('../../routes/subsamples');
// const { scan } = require('../../routes/background');
// const { default: NotFoundException } = require('../../exceptions/NotFoundException');
const NotFoundException = require('../../exceptions/NotFoundException');
// const background = require('../../routes/background');
// const samples = require('../../routes/samples');
// const Background = require('./background').Background;

const container = require('../container');


function isBackground(type) {
    return type in [ 
         "BACKGROUND",
        "RAW_BACKGROUND",
        "MEDIUM_BACKGROUND"

        ]
}



const { Prisma } = require('../client')
// const NotFoundException = require('../../exceptions/NotFoundException')

module.exports.Scans = class {

    constructor() {
        this.prisma = new Prisma().client;
        this.samples = container.get('samples');
      } 


      remap_scan(scan) {
        if (!scan) return null;

        // const sc = subsample.scanSubsamples?.map(ss => ss.scan)
        // console.log("sc", sc)

        let subsample = null;
        let scans = null;
        // Get the subsample object from the first scanSubsamples entry
        if ( scan.scanSubsamples && scan.scanSubsamples.length > 0 ) {
            subsample = scan.scanSubsamples[0].subsample;
    
        // Extract all scans from the subsample's scanSubsamples
            scans = subsample.scanSubsamples.map(ss => ss.scan);
        }
        // return {
        //     ...scan,
        //     // subsample: scan.scanSubsamples?.map(ss => ss.subsample)
        //     subsampleold: scan.scanSubsamples[0].subsample,
        //     subsample: scan.scanSubsamples[0].subsample.map(ss => ss.scan),

        //     scanSubsamples: null
        // }

        let data = {
            ...scan,
        }
        if (subsample) {
            data.subsample = {
                ...subsample,
                scanSubsamples: null
            };
            if ( scans ) {
                data.subsample.scan = scans;
            }
        }

        // return {
        //     ...scan,
        //     subsample: {
        //         ...subsample,
        //         scan: scans,
        //         scanSubsamples: null // Remove the scanSubsamples to avoid duplication
        //     },
        //     scanSubsamples: null // Remove the original scanSubsamples
        // };

        return data

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
        // return scans
        console.debug("scans", scans)

        const remapedScans = scans.map(scan => this.remap_scan(scan))
        console.log("remapedScans", remapedScans)
        return remapedScans
    }


    async findScan( {scanId }) {
        console.log("Prisma Scans findScan" , scanId)

        if (scanId == undefined ) throw "No scanId provided" //new Error({message:"No scanId provided"})

        const scan = await this.prisma.scan.findFirstOrThrow({
            where: {
                id: scanId
            },
        //     include: {
        //         // SubSample: true
        //         SubSample: {
        //             include: {
        //                 // scan: true,
        //                 scanSubsamples:{
        //                     include: {
        //                         subsample: true
        //                     }
        //                 }
        //             }
        //         }
        //     }
            include: {
                // scanSubsamples: true
                scanSubsamples:{
                    include: {
                //         subsample: {
                //             include: {
                                scan: false,
                                subsample : {
                                    include: {
                                        // scanSubsamples: true
                                        scanSubsamples:{
                                            include: {
                                                scan: true,
                                            }
                                        }
                                    }
                                }
                //             }
                //         }
                    }
                }
            }
        })

        // return scan
        const remapedScan = this.remap_scan(scan)
        console.log("remapedScan", remapedScan)
        return remapedScan
    }

    /**
     * return all the images associated with the project
     * @param {background} obsolette 
     * @returns 
     */
    async findAllFromProject( {background /*:boolean*/, projectId} ) {

        console.log("Prisma Scans findAllFromProject " , background)
        // console.log("Prisma Scans findAll - background: ", background)
        console.log("Prisma Scans findAllFromProject - projectId:", projectId)

        let where;
        if (projectId.match(/^[0-9a-fA-F]{24}$/)) {
            // It's an ObjectId
            where = { id: projectId };
        } else {
            // It's a name
            where = { name: projectId };
        }
        console.debug("where: ", where)

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

        // const scans = await this.prisma.scan.findMany({
        //     where: {
        //         // background: background,
        //         projectId: project.id
        //     },
        //     include:{
        //         instrument: true,
        //         // SubSample: true,
        //         // SubSample: {
        //         //     include: {
        //         //         // user: true,
        //         //         // user: false,
        //         //         metadata: true,
        //         //         qc: true ,
        //         //         // qc: {
        //         //         //     include: {
        //         //         //         // state : true
        //         //         //     }
        //         //         // }
        //         //         // scan: true,
        //         //         scanSubsamples:{
        //         //             include: {
        //         //                 subsample: true
        //         //             }
        //         //         }
        //         //     }
        //         // },
        //         scanSubsamples:{
        //             include: {
        //                 subsample: true
        //             }
        //         },
        //         user: true
        //     },
        //     // allowNull: true,
        //     orderBy:{
        //         createdAt: 'desc'
        //     }

        // //   include:{
        // //         background,
        // //         // project: {
        // //         //     include:{
        // //         //         drive: true,
        // //         //         ecotaxa: true,
        // //         //         samples: true,
        // //         //     }
        // //         // }
        // //     }
        // })


        const query = {
            where: {
                projectId: project.id
            },
            include:{
                instrument: true,
                scanSubsamples:{
                    include: {
                        subsample: true
                    }
                },
                user: true
            },
            orderBy:{
                createdAt: 'desc'
            }
        }

        console.debug("query: ", query)
        const scans = await this.prisma.scan.findMany(query)

        return scans
        const remapedScans = scans.map(scan => this.remap_scan(scan))
        console.log("remapedScans: ", remapedScans)
        return remapedScans
    }

    // async add({url, background, subsampleId, userId, instrumentId, projectId, type}) {
    /**
     * add a scan/image to the database
     */
    async add(params) {
        console.log("Prisma::Scans:add()")
        const {url, subsampleId, userId, instrumentId, projectId, type} = params

        if (!instrumentId || !userId || !projectId /*|| !subsampleId */) {
            throw new Error("Missing required IDs for instrument, user or project");
        }
        console.debug("Params OK")

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
        // if (subsampleId != undefined) {
        //     data['subsampleId'] = undefined // remove the old field
        // }


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

        const scanFound = await this.prisma.scan.findFirst({
            where: {
                url: data.url
            }
        })
        console.debug("scanFound: ", scanFound)

        // data['instrument']= {
        //     connect: {
        //         id: data['instrumentId']
        //     }
        // }
        // data['instrumentId'] = undefined

        // data['user'] = {
        //     connect: {
        //         id: data['userId']
        //     }
        // }
        // data['userId'] = undefined

        // data['Project'] = {
        //     connect: {
        //         id: data['projectId']
        //     }
        // }
        // data['projectId'] = undefined

        console.debug("data: ", data)

        // if (!data.instrumentId || !data.userId || !data.projectId) {
 

        const backgnd = isBackground(type)
        
        // if (backgnd) {
        if ( subsampleId == undefined) {
            const scan = await this.prisma.scan.upsert({
                where: {
                    url: url
                },
                update: {
                    type, //: "SCAN",
                    background: backgnd, //: isBackground(type), //false,
                    instrument: {
                        connect: { id: instrumentId }
                    },
                    user: {
                        connect: { id: userId }
                    },
                    Project: {
                        connect: { id: projectId }
                    },
                    // scanSubsamples: {
                    //     create: {
                    //         subsample: {
                    //             connect: { id: subsampleId }
                    //         }
                    //     }
                    // }
                },
                create: {
                    url: url,
                    type, //: "SCAN",
                    background: backgnd, // : isBackground(type), //false,
                    instrument: {
                        connect: { id: data.instrumentId }
                    },
                    user: {
                        connect: { id: data.userId }
                    },
                    Project: {
                        connect: { id: data.projectId }
                    },
                    // scanSubsamples: {
                    //     create: {
                    //         subsample: {
                    //             connect: { id: subsampleId }
                    //         }
                    //     }
                    // }
                }
            })

            console.log("scan: ", scan)
            return scan 
        }

        else {
        // if ( subsampleId)

        const scan = await this.prisma.scan.upsert({
            where: {
                url: url
            },
            update: {
                type, //: "SCAN",
                background: isBackground(type), //false,
                instrument: {
                    connect: { id: instrumentId }
                },
                user: {
                    connect: { id: userId }
                },
                Project: {
                    connect: { id: projectId }
                },
                scanSubsamples: {
                    create: {
                        subsample: {
                            connect: { id: subsampleId }
                        }
                    }
                }
            },
            create: {
                url: url,
                type, //: "SCAN",
                background: isBackground(type), //false,
                instrument: {
                    connect: { id: data.instrumentId }
                },
                user: {
                    connect: { id: data.userId }
                },
                Project: {
                    connect: { id: data.projectId }
                },
                scanSubsamples: {
                    create: {
                        subsample: {
                            connect: { id: subsampleId }
                        }
                    }
                }
            }
        })

        console.log("scan: ", scan)
        // return scan

        const remapedScan = this.remap_scan(scan)
        console.log("remapedScan: ", remapedScan)
        return remapedScan
    }


    

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


async linkToSubsample({ scanId, subSampleId }) {
    console.log("Prisma Scans: linking scan to subsample");
    console.log("scanId:", scanId);
    console.log("subSampleId:", subSampleId);
    
    // Check if the link already exists
    const existingLink = await this.prisma.subsampleScan.findFirst({
      where: {
        scanId: scanId,
        subsampleId: subSampleId
      }
    });
    
    if (existingLink) {
      console.log("Link already exists, returning conflict");
      return { 
        conflict: true, 
        message: "Link already exists",
        data: {
          scanId: existingLink.scanId,
          subSampleId: existingLink.subsampleId 
        }
      };
    }
    
    const newLink = await this.prisma.subsampleScan.create({
      data: {
        scanId: scanId,
        subsampleId: subSampleId
      }
    });
    
    // Transform the response to match API expectations
    return {
      scanId: newLink.scanId,
      subSampleId: newLink.subsampleId // Note the capital 'S' to match API expectations
    };
  }
  

} // class Scans
