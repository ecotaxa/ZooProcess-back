const { PrismaClient } = require("@prisma/client")

module.exports.Samples = class {

    constructor(){
        this.prisma = new PrismaClient()
    }

    async findAll(projectId) {
        const samples = await this.prisma.sample.findMany({
            where:{
                projectId:projectId
            }
        })

        console.log("Sample:", samples)

        return samples
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

        console.log("deleteSample: ",{projectId, sampleId});

        return this.prisma.sample.delete({
            where:{
                id:sampleId,
                //projectId:projectId
            }
        });
    }

}
