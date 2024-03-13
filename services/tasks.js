const { Prisma } = require('./client');

// const TaskType = require("./type/tasktype")

// export enum TaskType {
//     separate = "separate",
//     background = "background",
//     vignette = "vignette"
//   }

// module.exports.
const TaskType = {
    separate : "separate",
    background : "background",
    vignette : "vignette"
  }
  
  

module.exports.Tasks = class {

    constructor() {
        this.prisma = new Prisma().client;
    }

    async findAll() {
        return this.prisma.task.findAll()
    }

    async get({taskId}) {
        return this.prisma.task.findUnique({
            where:{
                id: taskId
            },
            include:{
            //     scan: true,
            //     task: true,
            //     // project: true,
            //     // user: true
                vignette: true,
            }
        })
    }


    async add(data) {

        console.log("Tasks::add(data= ", data)

        //if ( data ) 
        const exec = data.exec


        //(Object.values(TaskType)) as String[]).include(exec)
        if ( exec != TaskType.separate && exec != TaskType.background && exec != TaskType.vignette ) {
            throw new Error("TaskType not valid")
        }

        const formatdata = {
            exec: exec.toUpperCase(),
            params: data.params,
        }

        return this.prisma.task.create({data:formatdata}) // return the taskId
    }


    zooProcessApiUrl = "http://zooprocess.imev-mer.fr:8081/v1/"
    happyPipelineiUrl = 'http://zooprocess.imev-mer.fr:8000/'

    // async run(data){
    async run({taskId}){

        // const exec = data.exec

        // taskId = data.taskId

        const task = await this.prisma.task.findFirst({
            where:{
                id : taskId
            }
        })

        console.log("task", task)

        task["status"] = "RUNNING"
        task["dbserver"]= this.zooProcessApiUrl

        console.log("task", task)
        // Logger.info("task", task)

        // let dataupdated = {
        //     ...data,
        // }
        // dataupdated.params["dbserver"]= zooProcessApiUrl

        let action = null
        switch (task.exec){
            case TaskType.separate.toUpperCase():
                // return await this.separate(task)
                return await this.separate(task)
            default:
                throw new Error("TaskType not valid")

        }

    }


    async separate(data){

        console.log("tasks::separate", data)
        // this.prisma.separate()

        const taskId = data.id

        let srcFolder = ""
        let dstFolder = ""
        if ( data.params.src == null || data.params.dst == null /*|| data.params.projectid == null*/){

        // ici je connais les données, mais ai je toutes les infos ?
            const project = await this.prisma.project.findFirst({
                where:{
                    id: data.params.projectid
                },
                include:{
                    drive: true,
                    samples: true,
                }
            })
            console.log("project", project)

            if (project == null){
                throw new Error(`project ${data.params.projectid} not found.`)
            }

            // let driveurl = "" ;//project.drive.url
            // if (project.drive){
            //     driveurl = project.drive.url
            // } else {
            //     const drive = await this.prisma.drive.findFirst({
            //         where:{
            //             id: project.driveId
            //         }
            //     })
            //     if (drive == null){
            //         throw new Error("Cannot determine the drive url")
            //     }
            //     driveurl = drive.url
            // }

            const driveurl = project.drive.url
            console.log("driveurl", driveurl)

            const sample_name = project.samples.filter(sample => sample.id == data.params.sampleid)[0].name
            console.log("sample_name", sample_name)


            srcFolder = `${driveurl}/${project.name}Zooscan_scan/_work/${sample_name}/` + "/multiples_to_separate"
            console.log("srcFolder", srcFolder)

            srcFolder = "/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_200m_d1_1/multiples_to_separate/"
            console.log("HARD CODED: folder", srcFolder)
            // const data = {
            //     folder,
            
        // }
        } else {
            srcFolder = data.params.src
            dstFolder = data.params.dst
        }



        console.log("CALL HAPPY PIPELINE /separator/")
        fetch(this.happyPipelineiUrl+"separate/", {
        // method: 'POST',
        method: 'PUT',
        body: JSON.stringify({ path: srcFolder }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch(error => {
            console.log(error)
            return Promise().reject(`Cannot launch the task ${taskId} | Error: ${error}`)
        })

        const message = `Launched | Take a look at ${this.zooProcessApiUrl}tasks/${taskId}`
        console.log("message", message)
        //return new Promise().resolve(message)
        return message
    }

}
