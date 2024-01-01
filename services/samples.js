// const { PrismaClient } = require("@prisma/client");
const { Prisma } = require("./client");
// var flatMap = require('array.prototype.flatmap');

module.exports.Samples = class {

    constructor(){

        // this.prisma = new PrismaClient({
        //     log: ['query'],
        //   })
        // this.prisma = new PrismaClient()
        
        this.prisma = new Prisma().client;
    }

    async findAll(projectId) {
        // SampleView

        console.log("Samples findAll projectId= ", projectId);

        const samples = await this.prisma.sample.findMany({
        // const samples = await this.prisma.sampleview.findMany({
            where:{
                projectId:projectId
            },
            include:{
                metadata:true,
                metadataModel:true,
                subsample:true
            }
        })

        // console.log("Sample:", samples)

        const nsamples = samples.map((sample) => {

            // console.log("MAP sample: ", sample);

            const nbFractions = sample.subsample.length;
            let nbScans = 0
            // if ( nbFractions > 0 ) {
            //     nbScans = sample.subsample
            //     .flatMap((subsample) => subsample.scans.length )
            //     .reduce((a, b)=> a + b, 0);
            // }

            if ( nbFractions > 0 ) {
                nbScans = sample.subsample
                .flatMap((subsample) => { if (subsample.scans !== undefined ) return 1; return 0;})
                .reduce((a, b)=> a + b, 0);            }
         
            const ns = {
                ...sample,
                nbFractions,
                nbScans
            }
            return ns;
        })

        // const nsamples = {
        //     ...samples,
        //     count:3
        // }

        // console.log("nsamples: ", nsamples);

        return nsamples
    }

    async get({projectId, sampleId}) {
        const sample = await this.prisma.sample.findFirst({
            where:{
                id:sampleId,
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

    async add({projectId, sample}) {

        console.log("add sample: ", {projectId, sample});

        // const project = await this.prisma.project.findFirst({
        //     where:{
        //         id:projectId
        //     }
        // })
        // if ( project == null ) { throw()}
        // const data = {
        //     ...sample,
        //     projectId:project.id
        // }
        // console.log("Project: ", project )

        const metadataArray = this.metadata2Array(sample.data)

        const data = {
            // name:sample.name,
            projectId:projectId,
            metadata:{
                // create: metadataArray // simplement ou en desctructurer ci-dessous
                create: [
                        ...metadataArray
                    ]   
            }
        }

        if (sample.name){data['name']=sample.name}
        if (sample.metadataModelId){data['metadataModelId']=sample.metadataModelId}

        console.log("Create: ", data);

        return await this.prisma.sample.create({data})
      }
    
    async deleteSample({projectId, sampleId}) {

        console.log("deleteSample: ", {projectId, sampleId});

        // need to delete scan before

        const deleteSubSample = this.prisma.metadata.deleteMany({
            where:{
                sampleId
            }
        })

        const deleteSample = this.prisma.sample.delete({
            where:{
                id:sampleId,
                //projectId:projectId
            }
        })

        return await prisma.$transaction(
            [
                deleteSubSample,
                deleteSample
            ],
            // {
            //   isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
            // }
        )

        // return this.prisma.sample.delete({
        //     where:{
        //         id:sampleId,
        //         //projectId:projectId
        //     }
        // });
    }

}
