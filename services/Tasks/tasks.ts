// const background = require('../routes/background');

// import { Prisma, PrismaClient } from "@prisma/client";
// import { DefaultArgs } from "@prisma/client/runtime/library";

// const { update } = require('../routes/task');
const { Background } = require('../background');
const { Prisma } = require('../client');
const { Process } = require('./process');
// const { TaskType } = require('../type/tasktype');
const { TaskStatus, TaskType } = require('@prisma/client');


// const { strategies} = require("./strategies.js");
// const { SeparateStrategy } = require('./SeparateStrategy.js');
// const { SeparateStrategy } = require('./SeparateStrategy');
// const { ProcessStrategy } = require("./ProcessStrategy");
// const { BackgroundStrategy } = require("./BackgroundStrategy"); 
// const { DetectiondStrategy } = require("./DetectiondStrategy");
// const { VignetteStrategy } = require("./VignetteStrategy");
// const  SeparateStrategy  = require('./SeparateStrategy');
// const  ProcessStrategy  = require("./ProcessStrategy");
// const  BackgroundStrategy  = require("./BackgroundStrategy"); 
// const  DetectiondStrategy  = require("./DetectiondStrategy");
// const  VignetteStrategy  = require("./VignetteStrategy");

const  SeparateStrategy  = require('./SeparateStrategy').default;
const  ProcessStrategy  = require("./ProcessStrategy").default;
const  BackgroundStrategy  = require("./BackgroundStrategy").default;
const  DetectiondStrategy  = require("./DetectiondStrategy").default;
const  VignetteStrategy  = require("./VignetteStrategy").default;

// const TaskType = require("./type/tasktype")

// export enum TaskType {
//     separate = "separate",
//     background = "background",
//     vignette = "vignette"
//   }

// module.exports.
// const TaskType = {
//     separate : "separate",
//     background : "background",
//     vignette : "vignette",
//     process : "process",
//   }
  
  

// module.exports.Tasks = class {
class Tasks {
    prisma: any; // PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>; //PrismaClient;

    constructor() {
        this.prisma = new Prisma().client;
    }
    // async findAll() {




    //     // return this.prisma.task.findMany({})
    //     return this.prisma.task.findMany({
    //     orderBy: {
    //         updatedAt: 'desc'  // Sort by most recent first
    //     },
    //     take: 10  // Limit to 50 items
    // });
    // }

    async get({taskId}: {taskId: string}) {
        console.trace("❌ GET taskId",taskId)
        return this.prisma.task.findUnique({
            where:{
                id: taskId
            },
            include:{
            //     scan: true,
            //     task: true,
            //     // project: true,
            //     // user: true
                // vignette: true,
            }
        })
    }


    // async findAll(filter: any = {}) {
    //     const { project, sample, subsample, scanId, limit, ...otherFilters } = filter;
        
    //     // Build the where clause
    //     //const where: any = { ...otherFilters };
    //     let where : any = {};

    //     // // Add filter for exec type if needed
    //     // if (filter.exec) {
    //     //     where.exec = filter.exec;
    //     // } else {
    //     //     // Default to PROCESS if not specified
    //     //     where.exec = "PROCESS";
    //     // }
        
    //     // For MongoDB, we can directly query the JSON fields
    //     // if (project) {
    //     //     where['params.project'] = project;
    //     // }
        
    //     // if (sample) {
    //     //     where['params.sample'] = sample;
    //     // }
        
    //     // if (subsample) {
    //     //     where['params.subsample'] = subsample;
    //     // }
        
    //     if (scanId) {
    //         where['params.scanId'] = scanId;
    //     //     where['scanId'] = scanId;
    //     }
        
    //     console.log("Task findAll where clause:", JSON.stringify(where, null, 2));
        
    //     let data : any = {
    //         where,
    //         orderBy: {
    //             updatedAt: 'desc'  // Sort by most recent first
    //         },
    //     }

    //     if (limit){
    //         data.take=limit
    //     }

    //     // return this.prisma.task.findMany({
    //     //     where,
    //     //     orderBy: {
    //     //         updatedAt: 'desc'  // Sort by most recent first
    //     //     },
    //     //     take: limit  // Limit to 10 items
    //     // });

    //     return this.prisma.task.findMany(  data   );
    // }

// async findAll(filter: any = {}) {
//     const { projectId, sampleId, subsampleId, scanId, limit = 5, ...otherFilters } = filter;
    
//     // For MongoDB, we can use raw filtering
//     const where: any = { ...otherFilters };
    
//     // Create a params filter if any of the JSON fields are specified
//     if (projectId || sampleId || subsampleId || scanId) {
//         where.params = {};
        
//         if (projectId) {
//             where.params.project = projectId;
//         }
        
//         if (sampleId) {
//             where.params.sample = sampleId;
//         }
        
//         if (subsampleId) {
//             where.params.subsample = subsampleId;
//         }
        
//         if (scanId) {
//             where.params.scanId = scanId;
//         }
//     }
    
//     console.log("Task findAll where clause:", JSON.stringify(where, null, 2));
    
//     return this.prisma.task.findMany({
//         where,
//         orderBy: {
//             updatedAt: "desc"
//         },
//         take: parseInt(limit) || 5
//     });
// }

// 


// //
// // renvoit []
// async findAll(filter: any = {}) {
//     const { scanId, limit = 5 } = filter;
    
//     let where: any = {};
    
//     // Only filter by scanId if provided
//     if (scanId) {
//         // For MongoDB, we need to use a special syntax to query inside JSON
//         where = {
//             params: {
//                 equals: {
//                     scanId: scanId
//                 }
//             }
//         };
//     }
    
//     console.log("Task findAll where clause:", JSON.stringify(where, null, 2));
    
//     return this.prisma.task.findMany({
//         // where,
//         orderBy: {
//             updatedAt: "desc"
//         },
//         take: parseInt(limit as string) || 5
//     });
// }

// async findAll(filter: any = {}) {
//     const { scanId, limit = 5 } = filter;
    
//     let where: any = {};
    
//     // Only filter by scanId if provided
//     if (scanId) {
//         // Use string contains to find the scanId in the params JSON
//         where = {
//             params: {
//                 string_contains: `"scanId":"${scanId}"`
//             }
//         };
//     }
    
//     console.log("Task findAll where clause:", JSON.stringify(where, null, 2));
    
//     return this.prisma.task.findMany({
//         where,
//         orderBy: {
//             updatedAt: "desc"
//         },
//         take: parseInt(limit as string) || 5
//     });
// }


async findAll(filter: any = {}) {
    const { scanId, limit = 5 } = filter;
    
    // Get all tasks, sorted by most recent first
    const allTasks = await this.prisma.task.findMany({
        orderBy: {
            updatedAt: "desc"
        },
        take: 100 // Limit to avoid loading too many
    });
    
    // If no scanId provided, just return the tasks
    if (!scanId) {
        return allTasks.slice(0, parseInt(limit as string) || 5);
    }
    
    // Filter tasks with the matching scanId in params
    const filteredTasks = allTasks.filter((task:any) => {
        try {
            // Check if params exists and has the scanId we're looking for
            return task.params && 
                   typeof task.params === 'object' && 
                   task.params.scanId === scanId;
        } catch (e) {
            console.error("Error filtering task:", e);
            return false;
        }
    });
    
    console.log(`Found ${filteredTasks.length} tasks with scanId: ${scanId}`);
    
    // Return only the requested number of tasks
    const filtered = filteredTasks.slice(0, parseInt(limit as string) || 5);
    console.log("filtered:",filtered)
    return filtered;
}






    async add(data:any) {

        console.log("Tasks::add(data= ", data)

        //if ( data ) 
        const exec = data.exec
        console.debug("Add Tasks of type: ", exec)


        // (Object.values(TaskType)) as String[]).include(exec)
        if ( exec != TaskType.SEPARATE
            && exec != TaskType.BACKGROUND 
            && exec != TaskType.VIGNETTE 
            && exec != TaskType.PROCESS
        ) {
            throw new Error("Tasks.Tasks.add - TaskType not valid")
        }

        if (!Object.values(TaskType).includes(exec.toUpperCase())) {
            throw new Error("Invalid TaskType value")
        }

        const formatdata = {
            exec: exec.toUpperCase(),
            params: data.params,
        }

        return this.prisma.task.create({data:formatdata}) // return the taskId
    }


    zooProcessApiUrl = "http://zooprocess.imev-mer.fr:8081/v1/"
    happyPipelineUrl = 'http://zooprocess.imev-mer.fr:8000/'

    async put({taskId, newdata}: {taskId: string, newdata: any}){
        console.log("Task::put(taskId=",taskId, ", newdata=", newdata)
    
        return await this.get({taskId})
        .then(task => {
            console.log("task", task)
            let data = { ...task, ...newdata }
            return this.prisma.task.update({
                where:{
                    id : taskId
                },
                data
            })
        })
    }

    async exist({data}: {data:any}){
        console.log("Task::exist(data=", data)

        const type = data.type
        const params = data.params


        return await this.prisma.task.findFirst({
            where:{
                exec: type.toUpperCase(),
                params: params
            }
        })
    }

    async delete({taskId}: {taskId:string}){
        console.log("Task::delete(taskId=", taskId)
        return this.prisma.task.delete({
            where:{
                id: taskId
            }
        })
    }

    async deleteAll(){
        console.log("Task::deleteAll()")
        return this.prisma.task.deleteMany({})
    }

    // async deleteAllByProject({projectId}){
    //     console.log("Task::deleteAllByProject(projectId=", projectId)
    //     return this.prisma.task.deleteMany({
    //         where:{
    //             projectId: projectId
    //         }
    //     })
    // }

    ///TODO: A TESTER
    async deleteAllByProject({projectId}:{projectId:string}){

        // launch stop tasks before deleting tasks

        console.log("Task::deleteAllByProject(projectId=", projectId)
        return this.prisma.task.deleteMany({
            where:{
                // contains: {
                    params: {
                        contains: { projectId } }
                }
            // }
        })
    }

    async deleteAllByType({type}: {type:string}){
        console.log("Task::deleteAllByType(type=", type)
        return this.prisma.task.deleteMany({
            where:{
                exec: type.toUpperCase()
            }
        })
    }




    // async run(data){
    // async run({taskId},authHeader){

    //     // const exec = data.exec

    //     // taskId = data.taskId

    //     console.log("Task::run(taskId=", taskId)
    //     console.log("Task::run(authHeader=", authHeader)

    //     const bearer = authHeader.split(" ")[1]

    //     const task = await this.prisma.task.findFirst({
    //         where:{
    //             id : taskId
    //         }
    //     })

    //     console.log("task", task)

    //     task["status"] = "RUNNING"
    //     task["dbserver"]= this.zooProcessApiUrl

    //     console.log("task", task)
    //     // Logger.info("task", task)

    //     // let dataupdated = {
    //     //     ...data,
    //     // }
    //     // dataupdated.params["dbserver"]= zooProcessApiUrl

    //     const { strategies } = require('./strategies');


    //     let action = null
    //     switch (task.exec){
    //         case TaskType.separate.toUpperCase():
    //             // return await this.separate(task)
    //             console.debug(`run separate(task:${task})`)
    //             return await this.separate(task,bearer);

    //         case TaskType.process.toUpperCase():
    //             console.debug(`run Process(task:${JSON.stringify(task)})`);

    //             const process = new Process()
    //             // return await this.process(task, bearer)
    //             return await process.process(task, bearer,this)

    //             //TODO change the promise with code to do the processing job
    //             // return Promise(function(resolve, reject) {
    //             //     return resolve({taskId})
    //             // })

    //         default:

    //             throw new Error("TaskType not valid")

    //     }

    // }

    async run({taskId}: {taskId:string}, authHeader:any) {
        // const bearer = authHeader.split(" ")[1];
        // const task = await this.prisma.task.findFirst({
        //     where: { id: taskId }
        // });
        const task = await this.get({taskId});

        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        if (!task.exec) {
            console.error("Task exec is undefined!", task);
            throw new Error("Tasks.Tasks.run - Task exec is undefined!");
        }

        // const strategies: Record<string, any> = {
        //     [TaskType.SEPARATE]: SeparateStrategy,
        //     [TaskType.PROCESS]: ProcessStrategy,
        //     [TaskType.BACKGROUND]: BackgroundStrategy,
        //     [TaskType.DETECTION]: DetectiondStrategy,
        //     [TaskType.VIGNETTE]: VignetteStrategy,
        // };
        const strategies: Record<string, any> = {
            // "SEPARATE": SeparateStrategy,
            // "PROCESS": ProcessStrategy,
            // "BACKGROUND": BackgroundStrategy,
            // "DETECTION": DetectiondStrategy,
            // "VIGNETTE": VignetteStrategy,
        };

        // console.trace("Task::run Trace")
        console.debug("which strategies ?:" , task.exec )
        // console.debug("TaskType.SEPARATE", TaskType.SEPARATE)
        // console.debug("TaskType.PROCESS", TaskType.PROCESS)
        // console.debug("TaskType.BACKGROUND", TaskType.BACKGROUND)
        // console.debug("TaskType.DETECTION", TaskType.DETECTION)
        // console.debug("TaskType.VIGNETTE", TaskType.VIGNETTE)


        // const StrategyClass = strategies[task.exec];
        // console.debug("",StrategyClass);
        // if (!StrategyClass) {
        //     throw new Error("Tasks.Tasks.run - TaskType not valid");
        // }
    


        // const StrategyClass = strategies[task.exec];
        // const normalizedExec = task.exec.toUpperCase();
        // const StrategyClass = strategies[normalizedExec];
        // const trimmedExec = task.exec.trim();
        // const normalizedExec = trimmedExec.toUpperCase(); // Combine with uppercase normalization
        // let StrategyClass = strategies[normalizedExec];
        // console.debug("StrategyClass", StrategyClass);




        // if (!StrategyClass) {
        //     // throw new Error("Tasks.Tasks.run - TaskType not valid");
        //     // throw new Error(`Tasks.Tasks.run - TaskType not valid: ${task.exec} (normalized: ${normalizedExec}), available strategies: ${Object.keys(strategies).join(", ")}`);
        //     throw new Error(`Tasks.Tasks.run - TaskType not valid: ${task.exec}, available strategies: ${Object.keys(strategies).join(", ")}`);
        // }


        console.log("ProcessStrategy type:",ProcessStrategy)

        // const strategy = new StrategyClass(this);
        let strategy = undefined
        // if (task.exec == TaskType.PROCESS){
        //     strategy = new ProcessStrategy(this)
        //     return strategy.run(task, authHeader, this);
        // } else 
        //     if(task.exec == TaskType.BACKGROUND){
        //         strategy = new BackgroundStrategy(this)
        //         return strategy.run(task, authHeader, this);
        //     }

        switch (task.exec)
        {
            case TaskType.PROCESS:
                strategy = new ProcessStrategy(this)
                return strategy.run(task, authHeader, this);
            case TaskType.BACKGROUND:
                strategy = new ProcessStrategy(this)
                return strategy.run(task, authHeader, this);
            case TaskType.SEPARATE:
                strategy = new SeparateStrategy(this)
                return strategy.run(task, authHeader, this);
            case TaskType.DETECTION:
                strategy = new DetectiondStrategy(this)
                return strategy.run(task, authHeader, this);
            case TaskType.VIGNETTE:
                strategy = new VignetteStrategy(this)
                return strategy.run(task, authHeader, this);
        }



        // return strategy.execute(task, bearer);
        // return strategy.run(task, authHeader, this);
        throw new Error (`TaskType "${task.exec}" not managed.`)
    }
    


    // async separate(data,bearer){

    //     console.log("tasks::separate", data)
    //     // this.prisma.separate()

    //     const taskId = data.id

    //     // const 

    //     this.prisma.task.upsert({
    //         where:{
    //             id: taskId
    //         },
    //         update:{
    //             status: "RUNNING",
    //             // task.params.separator: 
    //         }
    //     })


    //     let srcFolder = ""
    //     let dstFolder = ""
    //     if ( data.params.src == null || data.params.dst == null /*|| data.params.projectid == null*/){

    //     // ici je connais les données, mais ai je toutes les infos ?
    //         const project = await this.prisma.project.findFirst({
    //             where:{
    //                 id: data.params.projectid
    //             },
    //             include:{
    //                 drive: true,
    //                 samples: true,
    //             }
    //         })
    //         console.log("project", project)

    //         if (project == null){
    //             throw new Error(`project ${data.params.projectid} not found.`)
    //         }

    //         // let driveurl = "" ;//project.drive.url
    //         // if (project.drive){
    //         //     driveurl = project.drive.url
    //         // } else {
    //         //     const drive = await this.prisma.drive.findFirst({
    //         //         where:{
    //         //             id: project.driveId
    //         //         }
    //         //     })
    //         //     if (drive == null){
    //         //         throw new Error("Cannot determine the drive url")
    //         //     }
    //         //     driveurl = drive.url
    //         // }

    //         const driveurl = project.drive.url
    //         console.log("driveurl", driveurl)

    //         const sample_name = project.samples.filter(sample => sample.id == data.params.sampleid)[0].name
    //         console.log("sample_name", sample_name)


    //         srcFolder = `${driveurl}/${project.name}Zooscan_scan/_work/${sample_name}/` + "/multiples_to_separate"
    //         console.log("srcFolder", srcFolder)

    //         srcFolder = "/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_200m_d1_1/multiples_to_separate/"
    //         console.log("HARD CODED: folder", srcFolder)
    //         // const data = {
    //         //     folder,
            
    //     // }
    //     } else {
    //         srcFolder = data.params.src
    //         dstFolder = data.params.dst
    //     }



    //     console.log("CALL HAPPY PIPELINE /separate/")
    //     console.debug("Trace")
    //     console.trace()
    // fetch(this.happyPipelineUrl+"separate/", {
    //     // method: 'POST',
    //     method: 'PUT',
    //     body: JSON.stringify({ path: srcFolder }),
    //     headers: { 
    //         'Content-type': 'application/json; charset=UTF-8',
    //         "Authorization": authHeader 
    //     },
    // })
    //     .then((response) => response.json())
    //     .then((json) => console.log(json))
    //     .catch(error => {
    //         console.log(error)
    //         console.log("taskId:", taskId)

    //         return new Promise((resolve, reject) => { reject(`Cannot launch the task ${taskId} | Error: ${error}`)});
    //     })

    //     const url = `${this.zooProcessApiUrl}task/${taskId}`
    //     const message = `Launched | Take a look at ${url}`

    //     const returndata = {
    //         //     status:200,
    //         //     data: { message }
    //         message,
    //         url,
    //         taskId
    //     }
    //     // console.log("returndata", returndata)
    //     // console.log("message", message)
    //     //return new Promise().resolve(message)
    //     // return returndata
    //     // return new Promise().resolve(message)
    //     // return message

    //     return new Promise(function(resolve, reject) {
    //         // return resolve(message)
    //         return resolve(returndata)
    //     })
    // }



    /**
     * 
     * @param {*} data 
     * @param {*} authHeader 
     * @returns 
     * 
     
    @startuml

front Participant as Front
api Participant as API
python as Pipeline

front -> api : process

api -> python : process 


hnote over front : ({projectId,smapleId, subSampleId, scanId})

api -> python : ({scanPath, backPath, taskID, DB, Bearer})

@enduml
     */

    // async process(data, authHeader){

    //     console.log("tasks::process", data)
    //     // this.prisma.separate()

    //     const taskId = data.id
    //     console.debug("process - taskId:",taskId)
    //     // const 

    //     this.prisma.task.upsert({
    //         where:{
    //             id: taskId
    //         },
    //         update:{
    //             status: "RUNNING",
    //             // task.params.separator: 
    //         }
    //     })


    //     let scanFile = ""
    //     let backFile = ""
    //     let srcFolder = ""
    //     let dstFolder = ""

    //     if ( data.params.back == null || data.params.scan == null ){

    //         console.debug("Need to build the parameters to run the task")
    //     // ici je connais les données, mais ai je toutes les infos ?
    //         const project = await this.prisma.project.findFirst({
    //             where:{
    //                 id: data.params.project
    //             },
    //             include:{
    //                 drive: true,
    //                 samples: true,
    //             }
    //         })
    //         console.log("project", project)

    //         if (project == null){
    //             throw new Error(`project ${data.params.project} not found.`)
    //         }

    //         const driveurl = project.drive.url
    //         console.log("driveurl", driveurl)

    //         // const sample_name = project.samples.filter(sample => sample.id == data.params.sampleid)[0].name
    //         const samples = project.samples.filter(sample => sample.id == data.params.sample)
    //         if ( samples.length == 0 ){
    //             throw new Error(`sample with id: ${data.params.sampleid} not found.`)
    //         }
    //         const sample_name = samples[0].name
    //         console.log("sample_name", sample_name)

    //         const projectFolder = `${driveurl}/${project.name}`

    //         srcFolder = `${projectFolder}/Zooscan_scan/_work/${sample_name}/`
    //         console.debug("srcFolder", srcFolder)

    //         dstFolder = `${projectFolder}/Zooscan_scan/_work/${sample_name}/`
    //         console.debug("dstFolder", dstFolder)

    //         // srcFolder = "/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_200m_d1_1/multiples_to_separate/"
    //         // srcFolder = "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/vignettes/"
    //         // console.log("HARD CODED: folder", srcFolder)

    //         console.debug("data.params", data.params)


    //         scanFile = `${srcFolder}/${data.params.scan}`
    //         backFile = `${srcFolder}/${data.params.back}`
            
    //         const scan = new Background()

    //         scanInfo = await scan.findScan(data.params.scanId)

    //         console.debug("scanInfo", scanInfo)
    //         scan = scanInfo.url

    //         backFile = await scan.findScan(data.params.backId)

    //         // const data = {
    //         //     folder,
            
    //     // }
    //     } else {
    //         scanFile = data.params.scan
    //         backFile = data.params.back
    //         srcFolder = data.params.src
    //         dstFolder = data.params.dst
    //     }

    //     const body = {
    //         //scanFile,
    //         //backFile,
    //         //srcFolder,
    //         //dstFolder
    //         path: srcFolder,
    //         // scan:scanFile,
    //         scanId: data.params.scanId,
    //         taskId: taskId,
    //         bearer:"bearer",
    //         db:"db",
    //         back:["url1","url2"]

    //         }
    //     // }
    //     // }

    //         const body2 = {
    //             path: srcFolder,
    //             dstFolder, 
    //             scan: scanFile,
    //             back: backFile,
    //             taskId: taskId,
    //             bearer:"bearer",
    //             db:"db",
    //             // back:["url1","url2"]
    //         }

    //     console.debug("body:", body)
    //     console.debug("body2:", body2)

    //     const processUrl = this.happyPipelineUrl+"process/"

    //     console.log("CALL HAPPY PIPELINE /process/")
    //     fetch(processUrl, {
    //         method: 'POST',
    //         // method: 'PUT',
    //         // body: JSON.stringify({ path: srcFolder }),
    //         body: JSON.stringify(body),
    //         // body,
    //         headers: { 
    //             'Content-type': 'application/json; charset=UTF-8',
    //             "Accept": "application/json",
    //             "User-Agent": "Zooprocess v10",
    //             // "Access-Control-Allow-Origin":"no-cors"
    //             "Authorization": authHeader

    //         },
    //     })
    //     .then(async (response) => {
    //         console.debug("---------> response", response)
    //         if (! response.ok) {
    //             // console.log("reponse:",response.status)
    //             // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`)
    //             const text = await response.text();
    //             console.error("Error details:", text);
    //             return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
    //         }
    //     return response.json()
    //     })
    //     // .then((json) => console.log(json))
    //     // .catch(error => {
    //     //     console.log(error)
    //     //     return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${error}`)
    //     // })

    //     const url = `${this.zooProcessApiUrl}task/${taskId}`
    //     const message = `Launched | Take a look at ${url}`

    //     const returndata = {
    //     //     status:200,
    //     //     data: { message }
    //         message,
    //         url,
    //         taskId
    //     }
    //     // console.log("returndata", returndata)
    //     // console.log("message", message)
    //     //return new Promise().resolve(message)
    //     // return returndata
    //     // return new Promise().resolve(message)
    //     // return message

    //     return new Promise(function(resolve, reject) {
    //         // return resolve(message)
    //         return resolve(returndata)
    //     })
    // }

    async update({taskId, data}:{taskId:string, data:any}){
        console.log("Task::exist(taskId=",taskId," data=", data)

        // return {"OK": "OK"}
        // return this.setTaskStatus(taskId, stadatatus)
        return this.setTaskStatus(taskId, data)
    }


    async setTaskStatus(taskId:string, data:any){
        console.debug("Tasks/tasks.js setTaskStatus --->  ", data)

        // return this.prisma.task.upsert({
        //     where:{
        //         id: taskId
        //     },
        //     update:{
        //         status: status.state,
        //         // task.params.separator:
        //     },
        //     create: {
        //         status: {
        //         state: "FINISHED",
        //         log: "log"
        //         }
        //     }
        // })
        try {
        return await this.prisma.task.update({
            where:{
                id: taskId
            },
            data: {
                status: data.status,
                //log: data.log
            }
        })
    }
    catch ( error ){
        console.error("prima error:", error)
    }
        // console.debug("setTaskStatus",status)
    }

//     async process(data, bearer){

//         console.log("tasks::process data:", data)
//         console.log("tasks::process bearer:", bearer)

//         const taskId = data.id
//         console.debug("process - taskId:",taskId)
//         this.setTaskStatus(taskId, {status:"ANALYSING",log:"analysing"})

//         const scanInfo = await new Background().findScan(data.params.scanId)

//         if ( scanInfo == null){
//             console.log("scanInfo is null")
//             this.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is null"})
//             return new Promise().reject(`Cannot launch the task ${taskId} | Error: there is no scan with id ${data.params.scanId}`)
//         }

//         console.debug("scanInfo", scanInfo)
        
//         if ( scanInfo.type != "SCAN" ){
//             console.log("scanInfo is not a scan")
//             this.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is not a scan"})
//             return new Promise().reject(`Cannot launch the task ${taskId} | Error: scanID ${scanInfo.id} is not a scan : ${scanInfo.type}`)
//         }

//         const background = scanInfo.SubSample.scan.find(scan => scan.type == "BACKGROUND")
//         if ( background == null ){
//             console.log("no background")
//             this.setTaskStatus(taskId, {status:"FAILED",log:"no background"})
//             return new Promise().reject(`Cannot launch the task ${taskId} there is no background | Error: ${scanInfo}`)
//         }
        
//         this.setTaskStatus(taskId, {status:"RUNNING",log:"running"})

//         const body = {

//             src: "srcpath",
//             dst: "dstpath",
//             scan: scanInfo.url,
//             back: background.url,

//             // scanId: data.params.scanId,
//             taskId: taskId,
//             bearer: bearer,
//             db: "http://zooprocess.imev-mer.fr:8081/v1/",
//         }

        
//         console.debug("body:", body)
        
//         const processUrl = this.happyPipelineUrl+"process/"

//         console.log("CALL HAPPY PIPELINE /process/")
//         fetch(processUrl, {
//             method: 'POST',
//             body: JSON.stringify(body),
//             headers: { 
//                 'Content-type': 'application/json; charset=UTF-8',
//                 "Accept": "application/json",
//                 "User-Agent": "Zooprocess v10",
//                 "Authorization": bearer

//             },
//         })
//         .then(async (response) => {
//             console.debug("---------> response", response)
//             if (! response.ok) {
//                 // console.log("reponse:",response.status)
//                 // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`)
//                 const text = await response.text();
//                 console.error("Error details:", text);
//                 return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
//             }
//         return response.json()
//         })
//         // .then((json) => console.log(json))
//         // .catch(error => {
//         //     console.log(error)
//         //     return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${error}`)
//         // })

//         const url = `${this.zooProcessApiUrl}task/${taskId}`
//         const message = `Launched | Take a look at ${url}`

//         const returndata = {
//         //     status:200,
//         //     data: { message }
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

}

module.exports = { Tasks }
