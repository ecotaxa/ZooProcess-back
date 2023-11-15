
const {PrismaClient} = require('@prisma/client')


let data = [
    {
      id: 1,
      name: 'sparky',
      type: 'dog',
      tags: ['sweet'],
    },
    {
      id: 2,
      name: 'buzz',
      type: 'cat',
      tags: ['purrfect'],
    },
    {
      id: 3,
      name: 'max',
      type: 'dog',
      tags: [],
    },
  ];


module.exports.Projects = class {

    constructor() {
      this.prisma = new PrismaClient()
      if (!this.prisma){
        throw("DB Error")
      }
    }

    async get() {
        const projects = await this.prisma.project.findMany()
        return projects
      }


    findAll({ type, limit }) {


        return  this.get()
        
        .then(res => {
            console.log("rrrr",res) 
            return res
        })
        .catch (async (e) => {
            console.error(e)
            throw(e)
        })
        // .finally(async (e) => {
        //     console.info("ferrme la boutique")
        //     console.log("eeeee",e)

        //     await this.prisma.$disconnect()
        // })

    //    // return data

    //   const projects =  this.get()
    // //   projects.then (async (p) => {

    // //         // const res = json({
    // //         //     status:200,
    // //         //     message:
    // //         // })

    // //         console.log("iiii",p)

    // //         return p
    // //     })
    // //     .catch (async (e) => {
    // //       console.error(e)
    // //       throw(e)
    // //     })
    // //     .finally(async (e) => {
    // //         console.info("ferrme la boutique")
    // //         console.log("eeeee",e)

    // //       await this.prisma.$disconnect()
    // //     })


        console.log("pppp",projects)

    // //     // projects.then(proj => {
    // //     //     return proj
    // //     // })

        console.error ('mes couilles pas attendu')

    //  return data

    //     return projects   
    }

}