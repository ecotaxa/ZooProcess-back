// obsolete move to ts file

// // const background = require('../routes/background');
// // const { update } = require('../routes/task');
// const background = require('../routes/background');
// const { Background } = require('./background');
// const { Prisma } = require('./client');
// const { Process } = require('./process');
// // const { TaskType } = require('./type/tasktype');

// // const TaskType = require("./type/tasktype")

// // export enum TaskType {
// //     separate = "separate",
// //     background = "background",
// //     vignette = "vignette"
// //   }

// // module.exports.
// const TaskType = {
//     separate : "separate",
//     background : "background",
//     vignette : "vignette",
//     process : "process",
//   }
  
  

// // module.exports.Tasks = class {
// class Tasks {

//     constructor() {
//         this.prisma = new Prisma().client;
//     }

//     async findAll() {
//         return this.prisma.task.findMany({})
//     }

//         /**
//          * @param taskId
//          */
//         async get(params) {
//         const {taskId} = params
//         if (taskId == undefined) {
//             throw new Error("taskId is undefined")
//         }
//         console.log("Tasks::get(taskId= ", taskId)
//         return this.prisma.task.findUnique({
//             where:{
//                 id: taskId
//             },
//             include:{
//             //     scan: true,
//             //     task: true,
//             //     // project: true,
//             //     // user: true
//                 // vignette: true,
//             }
//         })
//     }


//     async add(data) {

//         console.log("Tasks::add(data= ", data)

//         //if ( data ) 
//         const exec = data.exec
//         console.debug("Add Tasks of type: ", exec)

//         //(Object.values(TaskType)) as String[]).include(exec)
//         if ( exec != TaskType.separate
//             && exec != TaskType.background 
//             && exec != TaskType.vignette 
//             && exec != TaskType.process
//         ) {
//             throw new Error("Tasks.add - TaskType not valid")
//         }

//         const formatdata = {
//             exec: exec.toUpperCase(),
//             params: data.params,
//         }

//         return this.prisma.task.create({data:formatdata}) // return the taskId
//     } 


//     zooProcessApiUrl = "http://zooprocess.imev-mer.fr:8081/v1/"
//     happyPipelineUrl = 'http://zooprocess.imev-mer.fr:8000/'

//         /**
//          * @param taskId
//          * @param newdata
//          */
//         async put(params){
//         const {taskId, newdata} = params
//         console.log(`Task::update(${taskId}, data=${newdata})`)
    
//         return await this.get({taskId:taskId})
//         .then(task => {
//             console.log("task", task)
//             let data = { ...task, ...newdata }
//             return this.prisma.task.update({
//                 where:{
//                     id : taskId
//                 },
//                 data
//             })
//         })
//     }

//     async exist({data}){
//         console.log("Task::exist(data=", data)

//         const type = data.type
//         const params = data.params


//         return await this.prisma.task.findFirst({
//             where:{
//                 exec: type.toUpperCase(),
//                 params: params
//             }
//         })
//     }

//     async delete({taskId}){
//         console.log("Task::delete(taskId=", taskId)
//         return this.prisma.task.delete({
//             where:{
//                 id: taskId
//             }
//         })
//     }

//     async deleteAll(){
//         console.log("Task::deleteAll()")
//         return this.prisma.task.deleteMany({})
//     }

//     // async deleteAllByProject({projectId}){
//     //     console.log("Task::deleteAllByProject(projectId=", projectId)
//     //     return this.prisma.task.deleteMany({
//     //         where:{
//     //             projectId: projectId
//     //         }
//     //     })
//     // }

//     ///TODO: A TESTER
//     async deleteAllByProject({projectId}){

//         // launch stop tasks before deleting tasks

//         console.log("Task::deleteAllByProject(projectId=", projectId)
//         return this.prisma.task.deleteMany({
//             where:{
//                 // contains: {
//                     params: {
//                         contains: { projectId } }
//                 }
//             // }
//         })
//     }

//     async deleteAllByType({type}){
//         console.log("Task::deleteAllByType(type=", type)
//         return this.prisma.task.deleteMany({
//             where:{
//                 exec: type.toUpperCase()
//             }
//         })
//     }

//     async delete({projectId}){
//         console.log("Task::delete(projectId=", projectId)

//         if ( projectId == undefined) {
//             throw new Error("projectId is undefined")
//         }

//         if ( projectId == "all") {
//             return this.prisma.task.deleteMany({})
//         }

//         return this.prisma.task.deleteMany({
//             where:{
//                 projectId: projectId
//             }
//         })
//     }



//     // async run(data){
//     async run({taskId},authHeader){

//         // const exec = data.exec

//         // taskId = data.taskId

//         console.log("Service Task::run(taskId=", taskId)
//         console.log("Task::run(authHeader=", authHeader)
//         console.trace()

//         try {
//         const bearer = authHeader.split(" ")[1]

//         const task = await this.prisma.task.findFirst({
//             where:{
//                 id : taskId
//             }
//         })

//         console.log("task", task)

//         task["status"] = "RUNNING"
//         task["dbserver"]= this.zooProcessApiUrl

//         console.log("task", task)
//         // Logger.info("task", task)

//         // let dataupdated = {
//         //     ...data,
//         // }
//         // dataupdated.params["dbserver"]= zooProcessApiUrl

//         let action = null
//         switch (task.exec){
//             case TaskType.separate.toUpperCase():
//                 // return await this.separate(task)
//                 console.debug(`run separate(task:${task})`)
//                 return await this.separate(task,bearer);

//             case TaskType.process.toUpperCase():
//                 console.debug(`run Process(task:${JSON.stringify(task)})`);

//                 const process = new Process()
//                 // return await this.process(task, bearer)
//                 try{
//                 return await process.process(task, bearer, this)
//                 } catch(error){
//                     console.error("aaaaarrrrggggg" , error)
//                 }

//                 //TODO change the promise with code to do the processing job
//                 // return Promise(function(resolve, reject) {
//                 //     return resolve({taskId})
//                 // })

//             case TaskType.background.toUpperCase():

//             const background = new Background()
//                 return await background.medium(task, bearer, this)


//             default:

//                 throw new Error("Tasks.run - TaskType not valid")

//         }
//     } catch (error) {
//         console.debug("Exception catched")
//         console.error("error", error)
//         console.trace()

//         console.log(`Put the task ${taskId} as FAILED`)
//         // this.put({taskId, status:"FAILED"})
//         this.setTaskStatus(taskId, {status:"FAILED"})

//         // switch(error.name){
//         //     case "MissingDataException":
//         //         console.log("error.message", error.message)
//         //         break;

//         //         case "DataNotValidException":
//         //             console.log("error.message", error.message)
//         //             break;
                
//         //     default:
//         //         console.log("error.message", error.message)
//         //         throw error; // This will be caught by the route handler's try/catch
//         //         break;
//         // }
//         throw error; // This will be caught by the route handler's try/catch

//     }

//     }


//     async separate(data,bearer){

//         console.log("tasks::separate", data)
//         // this.prisma.separate()

//         const taskId = data.id

//         // const 

//         this.prisma.task.upsert({
//             where:{
//                 id: taskId
//             },
//             update:{
//                 status: "RUNNING",
//                 // task.params.separator: 
//             }
//         })


//         let srcFolder = ""
//         let dstFolder = ""
//         if ( data.params.src == null || data.params.dst == null /*|| data.params.projectid == null*/){

//         // ici je connais les données, mais ai je toutes les infos ?
//             const project = await this.prisma.project.findFirst({
//                 where:{
//                     id: data.params.projectid
//                 },
//                 include:{
//                     drive: true,
//                     samples: true,
//                 }
//             })
//             console.log("project", project)

//             if (project == null){
//                 throw new Error(`project ${data.params.projectid} not found.`)
//             }

//             // let driveurl = "" ;//project.drive.url
//             // if (project.drive){
//             //     driveurl = project.drive.url
//             // } else {
//             //     const drive = await this.prisma.drive.findFirst({
//             //         where:{
//             //             id: project.driveId
//             //         }
//             //     })
//             //     if (drive == null){
//             //         throw new Error("Cannot determine the drive url")
//             //     }
//             //     driveurl = drive.url
//             // }

//             const driveurl = project.drive.url
//             console.log("driveurl", driveurl)

//             const sample_name = project.samples.filter(sample => sample.id == data.params.sampleid)[0].name
//             console.log("sample_name", sample_name)


//             srcFolder = `${driveurl}/${project.name}Zooscan_scan/_work/${sample_name}/` + "/multiples_to_separate"
//             console.log("srcFolder", srcFolder)

//             srcFolder = "/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_200m_d1_1/multiples_to_separate/"
//             console.log("HARD CODED: folder", srcFolder)
//             // const data = {
//             //     folder,
            
//         // }
//         } else {
//             srcFolder = data.params.src
//             dstFolder = data.params.dst
//         }



//         console.log("CALL HAPPY PIPELINE /separate/")
//         console.debug("Trace")
//         console.trace()
//     fetch(this.happyPipelineUrl+"separate/", {
//         // method: 'POST',
//         method: 'PUT',
//         body: JSON.stringify({ path: srcFolder }),
//         headers: { 
//             'Content-type': 'application/json; charset=UTF-8',
//             "Authorization": authHeader 
//         },
//     })
//         .then((response) => response.json())
//         .then((json) => console.log(json))
//         .catch(error => {
//             console.log(error)
//             console.log("taskId:", taskId)

//             return new Promise((resolve, reject) => { reject(`Cannot launch the task ${taskId} | Error: ${error}`)});
//         })

//         const url = `${this.zooProcessApiUrl}task/${taskId}`
//         const message = `Launched | Take a look at ${url}`

//         const returndata = {
//             //     status:200,
//             //     data: { message }
//             message,
//             url,
//             taskId
//         }
//         // console.log("returndata", returndata)
//         // console.log("message", message)
//         //return new Promise().resolve(message)
//         // return returndata
//         // return new Promise().resolve(message)
//         // return message

//         return new Promise(function(resolve, reject) {
//             // return resolve(message)
//             return resolve(returndata)
//         })
//     }



//     /**
//      * 
//      * @param {*} data 
//      * @param {*} authHeader 
//      * @returns 
//      * 
     
//     @startuml

// front Participant as Front
// api Participant as API
// python as Pipeline

// front -> api : process

// api -> python : process 


// hnote over front : ({projectId,smapleId, subSampleId, scanId})

// api -> python : ({scanPath, backPath, taskID, DB, Bearer})

// @enduml
//      */

//     // async process(data, authHeader){

//     //     console.log("tasks::process", data)
//     //     // this.prisma.separate()

//     //     const taskId = data.id
//     //     console.debug("process - taskId:",taskId)
//     //     // const 

//     //     this.prisma.task.upsert({
//     //         where:{
//     //             id: taskId
//     //         },
//     //         update:{
//     //             status: "RUNNING",
//     //             // task.params.separator: 
//     //         }
//     //     })


//     //     let scanFile = ""
//     //     let backFile = ""
//     //     let srcFolder = ""
//     //     let dstFolder = ""

//     //     if ( data.params.back == null || data.params.scan == null ){

//     //         console.debug("Need to build the parameters to run the task")
//     //     // ici je connais les données, mais ai je toutes les infos ?
//     //         const project = await this.prisma.project.findFirst({
//     //             where:{
//     //                 id: data.params.project
//     //             },
//     //             include:{
//     //                 drive: true,
//     //                 samples: true,
//     //             }
//     //         })
//     //         console.log("project", project)

//     //         if (project == null){
//     //             throw new Error(`project ${data.params.project} not found.`)
//     //         }

//     //         const driveurl = project.drive.url
//     //         console.log("driveurl", driveurl)

//     //         // const sample_name = project.samples.filter(sample => sample.id == data.params.sampleid)[0].name
//     //         const samples = project.samples.filter(sample => sample.id == data.params.sample)
//     //         if ( samples.length == 0 ){
//     //             throw new Error(`sample with id: ${data.params.sampleid} not found.`)
//     //         }
//     //         const sample_name = samples[0].name
//     //         console.log("sample_name", sample_name)

//     //         const projectFolder = `${driveurl}/${project.name}`

//     //         srcFolder = `${projectFolder}/Zooscan_scan/_work/${sample_name}/`
//     //         console.debug("srcFolder", srcFolder)

//     //         dstFolder = `${projectFolder}/Zooscan_scan/_work/${sample_name}/`
//     //         console.debug("dstFolder", dstFolder)

//     //         // srcFolder = "/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_200m_d1_1/multiples_to_separate/"
//     //         // srcFolder = "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes/"
//     //         // console.log("HARD CODED: folder", srcFolder)

//     //         console.debug("data.params", data.params)


//     //         scanFile = `${srcFolder}/${data.params.scan}`
//     //         backFile = `${srcFolder}/${data.params.back}`
            
//     //         const scan = new Background()

//     //         scanInfo = await scan.findScan(data.params.scanId)

//     //         console.debug("scanInfo", scanInfo)
//     //         scan = scanInfo.url

//     //         backFile = await scan.findScan(data.params.backId)

//     //         // const data = {
//     //         //     folder,
            
//     //     // }
//     //     } else {
//     //         scanFile = data.params.scan
//     //         backFile = data.params.back
//     //         srcFolder = data.params.src
//     //         dstFolder = data.params.dst
//     //     }

//     //     const body = {
//     //         //scanFile,
//     //         //backFile,
//     //         //srcFolder,
//     //         //dstFolder
//     //         path: srcFolder,
//     //         // scan:scanFile,
//     //         scanId: data.params.scanId,
//     //         taskId: taskId,
//     //         bearer:"bearer",
//     //         db:"db",
//     //         back:["url1","url2"]

//     //         }
//     //     // }
//     //     // }

//     //         const body2 = {
//     //             path: srcFolder,
//     //             dstFolder, 
//     //             scan: scanFile,
//     //             back: backFile,
//     //             taskId: taskId,
//     //             bearer:"bearer",
//     //             db:"db",
//     //             // back:["url1","url2"]
//     //         }

//     //     console.debug("body:", body)
//     //     console.debug("body2:", body2)

//     //     const processUrl = this.happyPipelineUrl+"process/"

//     //     console.log("CALL HAPPY PIPELINE /process/")
//     //     fetch(processUrl, {
//     //         method: 'POST',
//     //         // method: 'PUT',
//     //         // body: JSON.stringify({ path: srcFolder }),
//     //         body: JSON.stringify(body),
//     //         // body,
//     //         headers: { 
//     //             'Content-type': 'application/json; charset=UTF-8',
//     //             "Accept": "application/json",
//     //             "User-Agent": "Zooprocess v10",
//     //             // "Access-Control-Allow-Origin":"no-cors"
//     //             "Authorization": authHeader

//     //         },
//     //     })
//     //     .then(async (response) => {
//     //         console.debug("---------> response", response)
//     //         if (! response.ok) {
//     //             // console.log("reponse:",response.status)
//     //             // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`)
//     //             const text = await response.text();
//     //             console.error("Error details:", text);
//     //             return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
//     //         }
//     //     return response.json()
//     //     })
//     //     // .then((json) => console.log(json))
//     //     // .catch(error => {
//     //     //     console.log(error)
//     //     //     return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${error}`)
//     //     // })

//     //     const url = `${this.zooProcessApiUrl}task/${taskId}`
//     //     const message = `Launched | Take a look at ${url}`

//     //     const returndata = {
//     //     //     status:200,
//     //     //     data: { message }
//     //         message,
//     //         url,
//     //         taskId
//     //     }
//     //     // console.log("returndata", returndata)
//     //     // console.log("message", message)
//     //     //return new Promise().resolve(message)
//     //     // return returndata
//     //     // return new Promise().resolve(message)
//     //     // return message

//     //     return new Promise(function(resolve, reject) {
//     //         // return resolve(message)
//     //         return resolve(returndata)
//     //     })
//     // }

//     async update({taskId, data}){
//         console.log("Task::exist(taskId=",taskId," data=", data)

//         return {"OK": "OK"}
//         return this.setTaskStatus(taskId, stadatatus)
//     }


//     setTaskStatus(taskId, data){
//         console.debug("tasks.js setTaskStatus:", data)
//         console.debug("fou")

//         // return this.prisma.task.upsert({
//         //     where:{
//         //         id: taskId
//         //     },
//         //     update:{
//         //         status: status.state,
//         //         // task.params.separator:
//         //     },
//         //     create: {
//         //         status: {
//         //         state: "FINISHED",
//         //         log: "log"
//         //         }
//         //     }
//         // })

//         console.debug ("prisma call")
//         try {
//         return this.prisma.task.update({
//             where:{
//                 id: taskId
//             },
//             data: {
//                 status: data.status,
//                 //log: data.log
//             }
//         })
//         // console.debug("setTaskStatus",status)

//     } catch(error){
//         console.error("Prisma Error", error)
//     }

//     }

// //     async process(data, bearer){

// //         console.log("tasks::process data:", data)
// //         console.log("tasks::process bearer:", bearer)

// //         const taskId = data.id
// //         console.debug("process - taskId:",taskId)
// //         this.setTaskStatus(taskId, {status:"ANALYSING",log:"analysing"})

// //         const scanInfo = await new Background().findScan(data.params.scanId)

// //         if ( scanInfo == null){
// //             console.log("scanInfo is null")
// //             this.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is null"})
// //             return new Promise().reject(`Cannot launch the task ${taskId} | Error: there is no scan with id ${data.params.scanId}`)
// //         }

// //         console.debug("scanInfo", scanInfo)
        
// //         if ( scanInfo.type != "SCAN" ){
// //             console.log("scanInfo is not a scan")
// //             this.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is not a scan"})
// //             return new Promise().reject(`Cannot launch the task ${taskId} | Error: scanID ${scanInfo.id} is not a scan : ${scanInfo.type}`)
// //         }

// //         const background = scanInfo.SubSample.scan.find(scan => scan.type == "BACKGROUND")
// //         if ( background == null ){
// //             console.log("no background")
// //             this.setTaskStatus(taskId, {status:"FAILED",log:"no background"})
// //             return new Promise().reject(`Cannot launch the task ${taskId} there is no background | Error: ${scanInfo}`)
// //         }
        
// //         this.setTaskStatus(taskId, {status:"RUNNING",log:"running"})

// //         const body = {

// //             src: "srcpath",
// //             dst: "dstpath",
// //             scan: scanInfo.url,
// //             back: background.url,

// //             // scanId: data.params.scanId,
// //             taskId: taskId,
// //             bearer: bearer,
// //             db: "http://zooprocess.imev-mer.fr:8081/v1/",
// //         }

        
// //         console.debug("body:", body)
        
// //         const processUrl = this.happyPipelineUrl+"process/"

// //         console.log("CALL HAPPY PIPELINE /process/")
// //         fetch(processUrl, {
// //             method: 'POST',
// //             body: JSON.stringify(body),
// //             headers: { 
// //                 'Content-type': 'application/json; charset=UTF-8',
// //                 "Accept": "application/json",
// //                 "User-Agent": "Zooprocess v10",
// //                 "Authorization": bearer

// //             },
// //         })
// //         .then(async (response) => {
// //             console.debug("---------> response", response)
// //             if (! response.ok) {
// //                 // console.log("reponse:",response.status)
// //                 // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`)
// //                 const text = await response.text();
// //                 console.error("Error details:", text);
// //                 return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
// //             }
// //         return response.json()
// //         })
// //         // .then((json) => console.log(json))
// //         // .catch(error => {
// //         //     console.log(error)
// //         //     return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${error}`)
// //         // })

// //         const url = `${this.zooProcessApiUrl}task/${taskId}`
// //         const message = `Launched | Take a look at ${url}`

// //         const returndata = {
// //         //     status:200,
// //         //     data: { message }
// //             message,
// //             url,
// //             taskId
// //         }
// //         // console.log("returndata", returndata)
// //         // console.log("message", message)
// //         //return new Promise().resolve(message)
// //         // return returndata
// //         // return new Promise().resolve(message)
// //         // return message

// //         return new Promise(function(resolve, reject) {
// //             // return resolve(message)
// //             return resolve(returndata)
// //         })
// //     }

// }

// module.exports = { Tasks }
