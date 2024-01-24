
const { Prisma } = require('./client')

module.exports.Login = class {

    constructor() {
        this.prisma = new Prisma().client;
      } 

      async login({email}) {

        console.log("Service Login: email = ", email)

        const user = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        return user
    }

    async logout({email}) {
        const drive = await this.prisma.user.findMany({
            where:{
                email
            }
        })
        return true
    }

}
