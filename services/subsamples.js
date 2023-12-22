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

    async findAll(sampleId) {
        // SampleView

        console.log("Samples findAll sampleId= ", sampleId);

        const samples = await this.prisma.subsample.findMany({
        // const samples = await this.prisma.sampleview.findMany({
            where:{
                sampleId:sampleId
            },
            include:{
                metadata:true,
                metadataModel:true,
                scan:true
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

    async get({/*projectId, sampleId,*/ subsampleId}) {
        const sample = await this.prisma.subsample.findFirst({
            where:{
                id:subsampleId,
                //projectId:projectId
            },
            include:{
                metadata:true,
                metadataModel:true,
                subsample:true
            }
        })
        return sample
    }

    

    async add({projectId, subsample}) {

        console.log("add subsample: ", {sampleId, subsample});

        const metadataArray = this.metadata2Array(subsample.data)

        const data = {
            // name:sample.name,
            sampleId:sampleId,
            metadata:{
                // create: metadataArray // simplement ou en desctructurer ci-dessous
                create: [
                        ...metadataArray
                    ]   
            }
        }

        if (subsample.name){data['name']=subsample.name}
        if (subsample.metadataModelId){data['metadataModelId']=subsample.metadataModelId}

        console.log("Create: ", data);

        return await this.prisma.subsample.create({data})
      }
    
    async deleteSample({projectId, sampleId, subsampleId}) {

        console.log("deleteSubSample: ", {projectId, sampleId, subsampleId});

        return this.prisma.subsample.delete({
            where:{
                id:subsampleId,
                //projectId:projectId
            }
        });
    }

}
