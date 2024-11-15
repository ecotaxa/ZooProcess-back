// const { PrismaClient } = require("@prisma/client");
const { Prisma } = require("./client");

module.exports.SubSamples = class {

    constructor(){

        // this.prisma = new PrismaClient({
        //     log: ['query'],
        //   })
        // this.prisma = new PrismaClient()
        
        this.prisma = new Prisma().client;
    }

    async findAll({projectId, sampleId}) {
        // SampleView

        console.log("SubSamples findAll projectId= ", projectId);
        console.log("SubSamples findAll sampleId= ", sampleId);

        // const samples = await this.prisma.subSample.findMany({
        // })
        const samples = await this.prisma.subSample.findMany({
            where:{
                sampleId
            },
            include:{
                metadata:true,
                metadataModel:true,
                // metadataModelId:false,
                scan:true,
                user:true,
            }
        })

        // console.log("Sample:", samples)

        // const nsamples = samples.map((sample) => {

        //     // console.log("MAP sample: ", sample);

        //     const nbFractions = sample.subsample.length;
        //     let nbScans = 0
        //     if ( nbFractions > 0 ) {
        //         nbScans = sample.subsample
        //         .flatmap((subsample) => subsample.scans.length )
        //         .reduce((a, b)=> a + b, 0);
        //     }

        //     const ns = {
        //         ...sample,
        //         nbFractions,
        //         nbScans
        //     }
        //     return ns;
        // })

        // const nsamples = {
        //     ...samples,
        //     count:3
        // }

        // console.log("nsamples: ", nsamples);

        // return nsamples
        return samples
    }

    async get({/*projectId, sampleId,*/ subSampleId}) {
        const sample = await this.prisma.subSample.findFirst({
            where:{
                id:subSampleId,
                //projectId:projectId
            },
            include:{
                scan:true,
                metadata:true,
                metadataModel:true,
                user:true,
                // subsample:true
                sample: {
                    include: {
                        metadata: true,
                    }
                },
                qc: true
            }
        })
        return sample
    }

    
    metadata2Array(metadata){

        const metadataArray = Object.keys(metadata).map( (elem) => {

            let data = {
                name:elem,
                value:String(metadata[elem]),
                type:typeof(metadata[elem])
            }

            return data;
        });

        console.log('metadataArray:', metadataArray);
        return metadataArray
    }

    async add({projectId, sampleId, subsample}) {

        console.log("add subsample: ", {projectId, sampleId, subsample});

        const metadataArray = this.metadata2Array(subsample.data)


        let userId = undefined;
        if ( subsample.user_id == null && subsample.data && subsample.data.scanning_operator){
            const user = await this.prisma.user.findFirstOrThrow(
            {
            where:{
                name: subsample.data.scanning_operator
            }
            });
            userId = user.id;
        } else {
            userId = subsample.user_id;
        }



        const data = {
            // name:sample.name,
            // sample:{
            //     connect: {
            //         sampleId
            //     }
            // },
            sampleId,
            userId,
            metadata:{
                // create: metadataArray // simplement ou en desctructurer ci-dessous
                create: [
                        ...metadataArray
                    ]   
            }
        }

        console.log("SubSamples add data: ", data)

        if (subsample.name){data['name']=String(subsample.name)}
        if (subsample.metadataModelId){data['metadataModelId']=subsample.metadataModelId}

        console.log("Create: ", data);

        return await this.prisma.subSample.create({data})
      }
    


    async deleteSubSample({projectId, sampleId, subSampleId}) {

        console.log("deleteSubSample: ", {projectId, sampleId, subSampleId});

        return await this.prisma.subSample.delete({
            where:{
                id:subSampleId,
                //projectId:projectId
            }
        });
    }

    async process(){
        console.log("service::subsamples:process()")
        return new Promise(function(resolve, reject) {
            // return resolve(message)

            const data = {
                "mask" : "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_msk1.gif",
                "out" : "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_out1.gif",
                "vis" :  "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_vis1.tif",
                "log" :  "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_log.txt",

            }

            return resolve(data)
        })
    }


}
