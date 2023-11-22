
const {PrismaClient} = require('@prisma/client')

module.exports.Projects = class {

    constructor() {
      this.prisma = new PrismaClient()
    }

    async findAll() {
        const projects = await this.prisma.project.findMany(
          {
          include:{
            drive: true,
            ecotaxa: true
          }
        })
        return projects
    }

    async add(project) {

      let driveid = undefined;
      if (project.driveid == null && project.drive){
        const drive = await this.prisma.drive.findFirstOrThrow(
        {
          where:{
            name:project.drive.name
          }
        });
        driveid = drive.id;
      } else {
        driveid = project.driveid;
      }
      
      // console.log("driveid: ", driveid);

      // let p = delete project['drive']

      // console.log("p:",p);

      const data = {
          ...project,
          driveId:driveid
      }

      // console.log("data: ", data);

      return await this.prisma.project.create({data})
    }
  
    

    async update(project){
      console.log("TODO")
      throw("TODO update")
    }

    async get(projectId){
      console.log("projectId:", projectId);

      const project = await this.prisma.project.findFirst({
        where:{
          id: projectId
        },
        include:{
          drive: true,
          ecotaxa: true
        }
      })
      return project
    }


    async updateid(id, data) {
      const project = await this.prisma.projects.update({
        where:{
          id : id
        },
        data: data
      })
      return project 
    }

    async update({body, params}) {

      console.log("projects:update:",body,params);
      const {id} = params;

      return this.updateid(+id, body)
        .then(res => {
            console.log("rrrr",res);
            // this.prisma.$disconnect()
            return res;
         })
        .catch(async(e) =>{
            // this.prisma.$disconnect()
            console.error(e);
            throw(e);
        }) 
    }

    async updateids(ids,data){

      const projects = await this.prisma.projects.updateMay({
        where:{
          id:{
            in:ids
          }
        },
        data: data
      })
      return projects
    }

    async updates({body, params}) {

      console.log("projects:update:",body,params);
      const ids = params.ids.split(',').map(id => +id);

      return this.updateids(ids, body)
        .then(res => {
            console.log("rrrr",res);
            // this.prisma.$disconnect()
            return res;
         })
        .catch(async(e) =>{
            // this.prisma.$disconnect()
            console.error(e);
            throw(e);
        }) 
    }


    async deleteid(id){
      const project = await this.prisma.projects.delete({
        where:{
          id:id
        }
      })
      return project
    }

    async delete({params}){
      console.log("projects:delete:",params);
      const {id} = params;

      return this.deleteid(+id)
        .then(res => {
            console.log("rrrr",res);
            // this.prisma.$disconnect()
            return res;
         })
        .catch(async(e) =>{
            // this.prisma.$disconnect()
            console.error(e);
            throw(e);
        })   
    }

    async deleteids(ids) {
      const count = await this.prisma.projects.deleteMany({
        where:{
          id:{
            in:ids
          }
        }
      });
      return count;
    }

    async deletes({params}) {
      console.log("projects:deletes:",body,params);
      const ids = params.ids.split(',').map(id => +id);

      return this.deleteids(ids)
        .then(res => {
            console.log("rrrr",res);
            // this.prisma.$disconnect()
            return res;
         })
        .catch(async(e) =>{
            // this.prisma.$disconnect()
            console.error(e);
            throw(e);
        })     
    }


    async nbSamples(project){
      const samples = await this.prisma.projects.findAll({
        include:{
          _count:{
            select:{
              samples:true
            }
          }
        }
      })
      return samples
    }

    async qcDone(project){
      const samples = await this.prisma.projects.findAll({
        include:{
          where:{
            QCState:"Done"
          }
        }
      })
      return samples
    }

    async findqcnotdone(){
      const samples = await this.prisma.samples.findAll({userid:id, project:projectid , qcState:"None"})
      return samples
    }


}
