
// const {PrismaClient} = require('@prisma/client');
const instrument = require('../../routes/instrument');
const { Prisma } = require('../client');
const { Instrument } = require('../instrument');
const { Qc } = require('../qc');
// const { Prisma } = require("@prisma/client");

const { Sample, Samples } = require ('../samples')

module.exports.Projects = class {

    constructor() {
      // this.prisma = new PrismaClient()
      this.prisma = new Prisma().client;
    }

    async findAll() {
        const projects = await this.prisma.project.findMany(
          {
          include:{
            drive: true,
            // ecotaxa: true,
            // samples: true,
            samples: {
              include:{
                subsample: {
                  include: {
                    // scan: true,
                    scanSubsamples: {
                      include: {
                          scan: true
                      }
                    }
                  }
                }
              }
            }
          //   _count:{
          //     select:{
          //       samples:true
          //       // samples:{
          //       //   where:{
          //       //     projectId
          //       //   }
          //       // }
          //     }
          //   },
          //   _count:{
          //     select:{
          //       scan:true
          //   }
          // }
          // nbsamples:{
          //   _count:{
          //     select:{
          //       samples:true
          //       // samples:{
          //       //   where:{
          //       //     projectId
          //       //   }
          //       // }
          //     }
          //   },
          // }
        }
        }
      )
      return projects
    }


    async getDriveID(project) {
      let driveid = undefined;
      
      if (project.driveid == null && project.driveId == null && project.drive){
        const drive = await this.prisma.drive.findFirstOrThrow(
        {
          where:{
            name:project.drive.name
          }
        });
        driveid = drive.id;
      } else {
        // driveid = project.driveid;
        if ( project.driveId!= null ) {
          driveid = project.driveId;
        } else if ( project.driveid!= null ) {
          driveid = project.driveid;
        }
      }
      return driveid;
    }


    async getInstrumentId(project) {
      let instrumentId = undefined;
      if (project.instrumentId == null && project.instrument ){
        console.debug("getInstrumentId: search instrument using Id: project.instrument.name: ", project.instrument.name);
        const instrument = await this.prisma.instrument.findFirstOrThrow(
        {
          where:{
            name:project.instrument.name
          }
        });
        instrumentId = instrument.id;
      } else {
          instrumentId = project.instrumentId;
      }
      return instrumentId;
    }
    

    async add(project) {

      let driveid = undefined;
      if (project.driveid == null && project.drive){
        const drive = await this.prisma.drive.findFirstOrThrow (
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
        driveId:driveid,
        instrumentId:project.instrumentId,
      }
      if (project.description){data['description'] = project.description;}
      if (project.ecotaxaId){data['ecotaxaId'] = project.ecotaxa;}
      if (project.acronym){data['acronym'] = project.acronym;}

      if ( project.QCState == undefined ){
        const qc = new Qc()
        const qcState = await qc.create({})
        console.log("qCStateId: ", qcState);
        data['qCStateId'] = qcState.id;
      } else {
        data['qCStateId'] = project.QCState.id;
      }

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

    // i found this query in the prisma documentation
    // then i can simply the code by using the following query
    // where: {
    //   OR: [
    //     { id: searchValue },
    //     { name: searchValue }
    //   ]
    // }

    async getProject(where){
      console.log("getProject(where:)", where);

      const project = await this.prisma.project.findFirst({
        where: where,
        include:{
          drive: true,
          qc: true,

          // samples: true,
          samples: {
            include: {
              // count: {
                subsample: {
                  include:{
                    scanSubsamples: {
                      include: {
                        scan:true
                      }
                    }
                  }
                },
                // _count: {
                //   subsample: true
                // }, 
            },

          },
          // ecotaxa: true,
          // instrument: true, // include don't get calibration information
        }
      })

      if (!project) {
        return null;
      }
      // let subsample_count = 0
      // if (project){
      //   project.samples.forEach( (sample) => {
        //  })
      // }

      let projectWithCalibration = project
      try {
        const instruments = new Instrument();
        if ( instruments && project.instrumentId ) {
          const instrument = await instruments.get(project.instrumentId)
          projectWithCalibration = {
            ...project,
            instrument,
         }
   
        } else {
          projectWithCalibration = project;
        }
    
        // console.debug("instrument: ", instrument);
  
      //  console.debug("projectWithCalibration: ", projectWithCalibration);

      }
      catch (err) {
        console.log("cannot get calibration information: ", err);
        projectWithCalibration = project;
      }

      // console.debug("project: ", project);
      // return project

      console.log("project: ", projectWithCalibration);
      return projectWithCalibration
    }


    async getUsingName(projectName){
      console.log("projectName:", projectName);
      const where = {
        name: projectName
      }
      return await this.getProject(where)
    }

    async get(projectId){
      console.log("projectId:", projectId);
      const where = {
        id: projectId
      }
      console.debug("where:", where);
      return await this.getProject(where)
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
      console.log("driveid: ", driveid);

      const instrumentId = await this.getInstrumentId(body);
      console.log("instrumentId: ", instrumentId);


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
        instrumentId
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
            console.log("updates - updated projects",res);
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
      console.debug("Project::deleteid: ", id)
      //const project = 
      await this.prisma.project.delete({
        where:{
          id:id
        }
      })

      // return project
      console.log( id + " deleted")
      return {}
    }

    async deletename(name){
      console.debug("Project::deletename: ", name)


      const project = await this.prisma.project.findFirst(
        {
          where:{
            name
          }
        }
      )

      if ( !project ) {
        console.log("project not found: ", name)
        return {}
      }

      console.log("project: ", project)
      const samples = new Samples()

      if (samples.length === 0) return {}

      await samples.deleteAll(project.id)

      await this.prisma.project.delete({
        where:{
          name
        }
      })
      console.log( name + " deleted")
      return {}
    }

    async delete({params}){
      console.log("projects:delete:",params);
      const {id} = params;

      // return this.deleteid(+id)
      return this.deletename(string(id))
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
      const samples = await this.prisma.sample.findAll({userid:id, project:projectid , qcState:"None"})
      return samples
    }


}
