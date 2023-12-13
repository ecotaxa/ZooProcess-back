
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
            ecotaxa: true,
            samples: true
          }
        })
        return projects
    }


    async getDriveID(project){
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
      return driveid;
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
      // const driveid = await this.getDriveID(project);

      // console.log("driveid: ", driveid);

      // let p = delete project['drive']

      // console.log("p:",p);

      // const data = {
      //     ...project,
      //     driveId:driveid
      // }

      let data = {
        name:project.name,
        driveId:driveid
      }
      if (project.description){data['description'] = project.description;}
      if (project.ecotaxaId){data['ecotaxaId'] = project.ecotaxa;}
      if (project.acronym){data['acronym'] = project.acronym;}



      console.log("data: ", data);

      return await this.prisma.project.create({data})
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
      console.log("projectId:", projectId);

      const project = await this.prisma.project.findFirst({
        where:{
          id: projectId
        },
        include:{
          drive: true,
          samples: true,
          ecotaxa: true
        }
      })
      return project
    }


    async updateid(id, data) {
      const project = await this.prisma.project.update({
        where:{
          id : id
        },
        data: data
      })
      return project 
    }

    async update({body, projectId}) {

      console.log("projects:update:");
      console.log("id: ", projectId);
      console.log("body: ", body);
      if ( body == undefined ){ throw("no data to update"); }
      if ( projectId == undefined ){ throw("project id undefined"); }

      // const {id} = projectId;

      // // return this.updateid(+id, body)
      // return this.updateid(projectId, body)
      //   .then(res => {
      //       console.log("rrrr",res);
      //       // this.prisma.$disconnect()
      //       return res;
      //    })
      //   .catch(async(e) =>{
      //       // this.prisma.$disconnect()
      //       console.error(e);
      //       throw(e);
      //   }) 

      const driveid = await this.getDriveID(body);

      console.log("driveid: ",driveid);

      //let projectbody = body;
      //delete projectbody.drive
      //console.log("projectbody: ",projectbody);
      
      let d = new Date();
      // let u = Date.UTC();

      // console.log("date: ",Date.now().toLocaleTimeString());
      // console.log("date: ",u.toLocaleString());

      let data = {
        //id: body.id,
        name: body.name,
        description: body.description,
        //createdAt: body.createdAt,
        updatedAt: d.toISOString(),
        driveId: driveid,
      }

      // if isManager(user) {
        if ( body.acronym ) { data['acronym'] = body.acronym; }
        if ( body.scanningOptions ) { data['scanningOptions'] = body.scanningOptions; }
      // }

      console.log("=== data: ", data);

      const project = await this.prisma.project.update({
        where:{
          id : projectId
        },
        data: data
      })
      return project 
    }


    async updateids(ids, data){

      const projects = await this.prisma.project.updateMay({
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
      const project = await this.prisma.project.delete({
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
      const count = await this.prisma.project.deleteMany({
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
      const samples = await this.prisma.project.findAll({
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
      const samples = await this.prisma.project.findAll({
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
