
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


        // return 
        const projectlist = await this.projects.findAll(//{
      //     include:{
      //       drive: true,
      //       ecotaxa: true,
      //       // samples: true,
      //       samples: {
      //         include:{
      //           subsample: true,
      //         }
      //       },
      //       user: true,
      //       // _count:{
      //       //   select:{
      //       //     samples:true
      //       //     // samples:{
      //       //     //   where:{
      //       //     //     projectId
      //       //     //   }
      //       //     // }
      //       //   }
      //       // },
      //     //   _count:{
      //     //     select:{
      //     //       scan:true
      //     //   }
      //     // }
      //   },
      //   // nbsamples:{
      //   //   _count:{
      //   //     select:{
      //   //       samples:true
      //   //       // samples:{
      //   //       //   where:{
      //   //       //     projectId
      //   //       //   }
      //   //       // }
      //   //     }
      //   //   },

      //   // }
      // }
      )

      // const nbSamples = projectlist.samples?.length
 
      // const nbScans = projectlist.samples?.map(sample => sample.subsample?.length).reduce((a,b) => a+b, 0)

      // const p = {
      //   projectlist,
      //   nbSamples,
      //   nbScans,
      // }

      // console.debug("p", p)

      // return p

      // projectlist.forEach(async project => {
      //   console.debug("project: ", project.id)
      //   const nbSamples = project.samples?.length || 0
      //   console.debug("nbSamples", nbSamples)
      //   project['nbSamples'] = nbSamples

      //   // const samples = this.projects.samples.() .getSamples(project.)
      //   // const nbScans = project.samples.flatMap(sample => sample.subsample?.length || 0).reduce((a,b) => a+b, 0)  
   
      //   // const proj = await this.get(project.id)
      //   // console.debug("proj", proj)
      //   // if (proj){
      //   //   // const nbScans = proj.samples?.subsample?.length
      //   //   const nbScans = proj.samples?.flatMap(sample => sample.subsample?.length || 0).reduce((a,b) => a+b, 0)  

      //   //   console.debug("nbScans", nbScans)
      //   //   project['nbScans'] = nbScans
      //   // } else {
      //   //   project['nbScans'] = 0
      //   // }
        
      //   // const nbScans = this.get(project.id)
      //   // .then(p => {
      //   //   console.debug("project: ", p)
      //   //   const nbScans = proj.samples?.flatMap(sample => sample.subsample?.length || 0).reduce((a,b) => a+b, 0)  
      //   //   console.debug("nbScans", nbScans)
      //   //   project['nbScans'] = nbScans
      //   //   return nbScans
      //   // })
      //   // .catch(err => {
      //   //   console.log("Cannot get project : ", project.id, " Error: ", err)
      //   //   project['nbScans'] = 0
      //   //   return 0
      //   // })

      //   // const subsampleids = this.get(project.id)
      //   // .then(p => {
      //   //   console.debug("analyse project: ", p.samples)

      //   //   const subsampleids = p.samples?.flatMap(sample => { 
      //   //       console.debug("sample: ", sample); 
              
      //   //       const subsampleids = sample.subsample?.map(subsample => {
      //   //         console.debug("subsample: ", subsample);
      //   //         return subsample.id
      //   //     } )

      //   //       // return sample.subsample.id 
      //   //       return subsampleids
      //   //     } )
          
          
      //   //       console.debug("intern subsampleids", subsampleids)

      //   //   return subsampleids

      //   //   // const nbScans = proj.samples?.flatMap(sample => sample.subsample?.length || 0).reduce((a,b) => a+b, 0)  
      //   //   // console.debug("nbScans", nbScans)
      //   //   // project['nbScans'] = nbScans
      //   //   // return nbScans
      //   // })
      //   // .catch(err => {
      //   //   console.log("Cannot get project : ", project.id, " Error: ", err)
      //   //   project['nbScans'] = 0
      //   //   return 0
      //   // })

      //   const subsampleids = await this.getSubSampleIds(project.id)

      //   console.debug("subsampleids", subsampleids)
      //   project['subsampleids'] = subsampleids

      //   // console.debug("nbScans", nbScans)
      //   // project['nbScans'] = - nbScans
      // })

      // await this.getInfo(projectlist)


      console.debug("projectlist", projectlist)

      return projectlist

    }

    // async getInfo(projectlist) {

    //   projectlist.forEach( project => {
    //     console.debug("project: ", project.id)
    //     const nbSamples = project.samples?.length || 0
    //     console.debug("nbSamples", nbSamples)
    //     project['nbSamples'] = nbSamples

    //     const subsampleids =  this.getSubSampleIds(project.id)

    //     console.debug("subsampleids", subsampleids)
    //     project['subsampleids'] = subsampleids

    //     // console.debug("nbScans", nbScans)
    //     // project['nbScans'] = - nbScans
    //   })

    // }

    //  getSubSampleIds(projectid) {


    //   const subsampleids =  this.get(projectid)
    //     .then(p => {
    //       console.debug("analyse project: ", p.samples)

    //       const subsampleids = p.samples?.flatMap(sample => { 
    //           console.debug("sample: ", sample); 
              
    //           const subsampleids = sample.subsample?.map(subsample => {
    //             console.debug("subsample: ", subsample);
    //             return subsample.id
    //         } )

    //           // return sample.subsample.id 
    //           return subsampleids
    //         } )
          
          
    //           console.debug("intern subsampleids", subsampleids)

    //       return subsampleids

    //       // const nbScans = proj.samples?.flatMap(sample => sample.subsample?.length || 0).reduce((a,b) => a+b, 0)  
    //       // console.debug("nbScans", nbScans)
    //       // project['nbScans'] = nbScans
    //       // return nbScans
    //     })
    //     .catch(err => {
    //       console.log("Cannot get project : ", project.id, " Error: ", err)
    //       // project['nbScans'] = 0
    //       return 0
    //     })

    //     console.debug("subsampleids", subsampleids)
    //     // project['subsampleids'] = subsampleids
    //     return subsampleids
    // }


    async getDriveID(project){
      return this.projects.getDriveID(project)
    }

    async getInstrumentId(project){
      return this.projects.getInstrumentId(project)
    }

    // add a new project
    // create folder 
    // and db entry
    async add(project) {

      project.driveid = await this.getDriveID(project)
      project.getInstrumentId = await this.getInstrumentId(project)

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
      console.debug("projectId(): ", projectId)
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
