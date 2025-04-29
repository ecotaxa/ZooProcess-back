

const { Prisma } = require('../client')
module.exports.SubSamples = class {

    constructor() {
        this.prisma = new Prisma().client;
      } 

    async find({subSampleId}) {

        // const subSample = this.prisma.subSample.findFirst({
        //     where:{
        //         id:subSampleId
        //       },
        //       include:{
        //         sample:{
        //           include:{
        //             project:{
        //                 include:{
        //                     drive:true
        //                     }
        //                 }
        //             }
        //         }//,
        //         //scan:true
        //     }
        // }
        // )
        console.debug("findMany")
        const subSample = await this.prisma.subSample.findMany({
            where:{
                id:subSampleId
            },
            include:{
                sample:{
                    include:{
                        project:{
                            include:{
                                drive:true
                            }
                        }
                    }
                },//,
                //scan:true
                scanSubsamples:{
                    include:{
                        scan:true
                    }
                }
            }
        }
        )

        console.debug("subSample: ", subSample)
        return subSample
    }
    


}


