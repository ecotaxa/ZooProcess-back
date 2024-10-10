
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
      console.log("userId:", userId);

      const user = await this.prisma.user.findFirst({
        where:{
          id: userId
        },
        include:{
        //   project: true,
        //   samples: true,
          subSample: true
        }
      })
      console.debug("user: ", user);
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

    // async update({body, userId}) {

    //   console.log("user:update:");
    //   console.log("id: ", userId);
    //   console.log("body: ", body);
    //   if ( body == undefined ){ throw("no data to update"); }
    //   if ( userId == undefined ){ throw("user id undefined"); }

    //   const user = await this.prisma.user.update({
    //     where:{
    //       id : userId
    //     },
    //     data: data
    //   })
    //   return user 
    // }

    async update({body, userId}) {

      console.log("user:update:");
      console.log("id: ", userId);
      console.log("body: ", body);
      if ( body == undefined ){ throw("no data to update"); }
      if ( userId == undefined ){ throw("user id undefined"); }

      const data = await this.prisma.user.findUnique({
        where:{
          id: userId
        }
      })

      if ( data == undefined ){
        throw('No user')
      }

      console.log ("data: ", data)

      let newData = {
        ...data,
        ...body
      }
      delete newData['id']

      console.log("newData: ", newData)

      const user = await this.prisma.user.update({
        where:{
          id : userId
        },
        data: newData
      })
      return user 
    }

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


}
