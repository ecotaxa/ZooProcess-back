const {PrismaClient} = require('@prisma/client')


module.exports.MetadataModel = class {

    constructor(){
        this.prisma = new PrismaClient()
    }

    async findAll(sample){

        let query = {}
        if (sample == true){
            query = {
                include:{
                    sample: true
                }
            }
        }

        return await this.prisma.metadataModel.findMany(query)
    }

    async add(metadatatype) {

        const data = {
            ...metadatatype
        }

        return await this.prisma.metadataModel.create({data})
    }

    async get(metadatatypeid){
        return await this.prisma.metadataModel.findFirst({
            where:{
                id:metadatatypeid
            }
        })
    }

    async deleteMetadataModel(metadatamodelid){

        console.log("deleteMetadata: ", metadatamodelid);

        const sample = await this.prisma.metadataModel.findUnique({
            where: {
                id:metadatamodelid
            },
            include: {
                sample: true,
                SubSample: true
            }
        })

        if ( sample ){
            console.log("count sample: ", sample.sample.length)
            console.log("count sample: ", sample.SubSample.length)
    
            if ( sample.sample.length || sample.SubSample.length ){
                throw ("Not Empty")
            }
        }

        return await this.prisma.metadataModel.delete({
            where:{
                id:metadatamodelid,
            }
        });

    }

}
