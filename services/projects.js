
// const {PrismaClient} = require('@prisma/client');
// const { Prisma } = require('./client');
const { Projects } = require("./prisma/projects");

const fs = require('fs');
const path = require('path')

module.exports.Projects = class {

    constructor() {
      // this.prisma = new PrismaClient()
      // this.prisma = new Prisma().client;
      this.projects = new Projects()
    }

    async findAll() {
        return this.projects.findAll()
    }


    async getDriveID(project){
      return this.projects.getDriveID(project)
    }

    // add a new project
    // create folder 
    // and db entry
    async add(project) {

      project.driveid = await this.getDriveID(project)

      if ( project.drive && project.drive.name) {
        const folderName = path.join(process.env.DRIVES_PATH, project.drive.name , project.name)
        if (!fs.existsSync(folderName)) 
            fs.mkdirSync(folderName,'0777', true)
      }


      return this.projects.add(project)
    }
  
    

    // async update(projectId, data){
    //   console.log("TODO")
    //   console.log("projectId:", projectId);

    //   const project = await this.prisma.projects.update({
    //     where:{
    //       id : projectId
    //     },
    //     data: data
    //   })
    //   return project 
    // }

    async get(projectId){
      return this.projects.get(projectId)
    }


    async updateid(id, data) {
      return this.projects.updateid(id, data)
    }

    async update({body, projectId}) {
      return this.projects.update({body, projectId})
    }


    async updateids(ids, data){
      return this.projects.updateids(ids, data)

    }

    async updates({body, params}) {
      return this.projects.updates({body, params})
    }


    async deleteid(id){
      return this.projects.deleteid(id)
    }

    async delete({params}){
      return this.projects.delete({params})
    }

    async deleteids(ids) {
      return this.projects.deleteids(ids)
    }

    async deletes({params}) {
      return this.projects.deletes({params})
    }


    async nbSamples(project){
      return this.projects.nbSamples(project)
    }

    async qcDone(project){
      return this.projects.qcDone(project)
    }

    async findqcnotdone(){
      return this.projects.findqcnotdone()
    }


}
