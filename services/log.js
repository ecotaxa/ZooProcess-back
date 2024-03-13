const { get } = require("../app")
const { Projects } = require("./prisma/projects")




class Log {

    // constructor() {
    //     this.prisma = new Prisma().client;
    // }

    add(projectid, data) {

        const project = Projects().get(projectid)

        if ( project == null ) { 
            console.log(`project ${projectid} not found`)
            return
        }

        // const logFile = project.logFile
        // append logFile with data

    }

}