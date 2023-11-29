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

}
