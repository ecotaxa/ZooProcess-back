

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

        const subSample = this.prisma.subSample.findMany({
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

        return subSample
    }
    


}


