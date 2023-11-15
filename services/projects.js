
const {PrismaClient} = require('@prisma/client')

module.exports.Projects = class {

    constructor() {
      this.prisma = new PrismaClient()
    }

    async get() {
        const projects = await this.prisma.project.findMany()
        return projects
      }

    findAll({ type, limit }) {

        return this.get()
        .then(res => {
            console.log("rrrr",res) 
            this.prisma.$disconnect()
            return res
        })
        .catch (async (e) => {
            this.prisma.$disconnect()
            console.error(e)
            throw(e)
        })
    }

}