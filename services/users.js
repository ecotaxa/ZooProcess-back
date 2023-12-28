
// const {PrismaClient} = require('@prisma/client');
const { Prisma } = require('./client');

module.exports.Users = class {

    constructor() {
      // this.prisma = new PrismaClient()
      this.prisma = new Prisma().client;
    }

    async findAll() {
        const users = await this.prisma.user.findMany(
          {}
        )
        return users
    }

    
    async add(user) {

      console.log("user: ", user);

      const data = {
        name:user.name,
        email: user.email,
      } 

      return await this.prisma.user.create({data})
    }


    async get(userId){
      console.log("projectId:", userId);

      const user = await this.prisma.user.findFirst({
        where:{
          id: userId
        },
        include:{
        //   project: true,
        //   samples: true,
          SubSample: true
        }
      })
      return user
    }


    async updateid(id, data) {
      const user = await this.prisma.user.update({
        where:{
          id : id
        },
        data: data
      })
      return user 
    }

    async update({body, userId}) {

      console.log("user:update:");
      console.log("id: ", userId);
      console.log("body: ", body);
      if ( body == undefined ){ throw("no data to update"); }
      if ( userId == undefined ){ throw("user id undefined"); }

      const user = await this.prisma.user.update({
        where:{
          id : userId
        },
        data: data
      })
      return user 
    }


    // async updateids(ids, data){

    //   const projects = await this.prisma.project.updateMay({
    //     where:{
    //       id:{
    //         in:ids
    //       }
    //     },
    //     data: data
    //   })
    //   return projects
    // }

    // async updates({body, params}) {

    //   console.log("projects:update:",body,params);
    //   const ids = params.ids.split(',').map(id => +id);

    //   return this.updateids(ids, body)
    //     .then(res => {
    //         console.log("rrrr",res);
    //         // this.prisma.$disconnect()
    //         return res;
    //      })
    //     .catch(async(e) =>{
    //         // this.prisma.$disconnect()
    //         console.error(e);
    //         throw(e);
    //     }) 
    // }


    async deleteid(id){
      const user = await this.prisma.user.delete({
        where:{
          id:id
        }
      })
      return user
    }

 
    async nbSamples(userId){
      const samples = await this.prisma.user.findAll({
        where:{
            userId:userId
        },
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

    // async qcDone(project){
    //   const samples = await this.prisma.project.findAll({
    //     include:{
    //       where:{
    //         QCState:"Done"
    //       }
    //     }
    //   })
    //   return samples
    // }

    // async findqcnotdone(){
    //   const samples = await this.prisma.samples.findAll({userid:id, project:projectid , qcState:"None"})
    //   return samples
    // }


}
