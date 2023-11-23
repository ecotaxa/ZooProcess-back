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
        return samples
    }

    async get({projectId,sampleId}) {
        const sample = await this.prisma.sample.findFirst({
            where:{
                id:sampleId,
                projectId:projectId
            }
        })
        return sample
    }


    async add({projectId, sample}) {

        const project = await this.prisma.project.findFirst({
            where:{
                id:projectId
            }
        })

        const data = {
            ...sample,
            projectId:project.id
        }

        return await this.prisma.sample.create({data})
      }
    
}
