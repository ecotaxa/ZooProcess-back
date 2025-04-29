// const background = require('../routes/background');
const DataNotValidException = require('../exceptions/DataNotValidException');
const MissingDataException = require('../exceptions/MissingDataException');
const { Background } = require('./background');
const { Projects } = require('./projects');
const { SubSamples } = require('./subsamples');


// const { Prisma } = require('./client');
const path = require('path');

const container = require('./container');


class Process {

//TODO mettre ça en un endroit unique car il y a des copies
zooProcessApiUrl = "http://zooprocess.imev-mer.fr:8081/v1/"
happyPipelineUrl = 'http://zooprocess.imev-mer.fr:8000/'

async process(data, bearer,taskInstanceParam){
    try {

    console.log("tasks::process data:", data)
    console.log("tasks::process bearer:", bearer)
    console.log("tasks::process taskInstanceParam:", taskInstanceParam != undefined)

    // const { project:projectId, sample:sampleId, subsample:subSampleId } = data
    // const { project, sample , subsample } = data

    const projectId = data.params.project
    const sampleId = data.params.sample
    const subSampleId = data.params.subsample

    console.debug("projectId:",projectId)
    console.debug("sampleId:",sampleId)
    console.debug('subSampleId:',subSampleId)

    const taskInstance = container.get('tasks');

    console.debug("get the taskInstance")

    const taskId = data.id
    console.debug("process - taskId:",taskId)
    // await taskInstance.setTaskStatus(taskId, {status:"ANALYSING",log:"analysing blabla"})

    // const scanInfo = await new Background().findScan(data.params.scanId,false)

    // let scanInfo = undefined
    // let background = undefined


    console.debug("get projects instance")
    const projects /*: Projects*/ /*: SubSamples*/ = container.get('projects');
    console.debug("get projects instance OK")

    console.debug("get projects")
    const projectData = await projects.get(projectId)
    console.debug("project", project)

    const subsamples /*: SubSamples*/ = container.get('subsamples');
    
    const subsampleData = await subsamples.get(projectId,sampleId,subSampleId)
    console.debug("subsample", subsample)

    const scanInfo = subsample.scan.find((scan)=>scan.type=="SCAN")
    console.debug("scanInfo", scanInfo)
    if ( scanInfo == null){
        console.log("scanInfo is null")
        taskInstance.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is null"})
        // return Promise.reject(`Cannot launch the task ${taskId} | Error: there is no scan with id ${data.params.scanId}`)
        throw new MissingDataException(`Cannot launch the task ${taskId} | Error: there is no scan with id ${data.params.scanId}`)
    }

    const background = subsample.scan.find((scan)=>scan.type=="MEDIUM_BACKGROUND")
    console.debug("background", background)
    if ( background == null ){
        console.log("no background")
        taskInstance.setTaskStatus(taskId, {status:"FAILED",log:"no background"})
        // return Promise.reject(`Cannot launch the task ${taskId} - Error: there is no background - Error: ${JSON.stringify(scanInfo)}`)
        // return Promise.reject(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)
        // throw new Error(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)
        throw new MissingDataException(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)
    }

    taskInstance.setTaskStatus(taskId, {status:"RUNNING",log:"running"})

    // determine path from project data
    const driveUrl = project.drive.url
    const dstPath = path.join(driveUrl, project.name, subsample.name)
    console.debug("dstPath:", dstPath)

    const body = {

        src: "srcpath",
        dst: "dstpath",
        scan: scanInfo.url,
        back: background.url,

        // scanId: data.params.scanId,
        taskId: taskId,
        bearer: bearer,
        db: "http://zooprocess.imev-mer.fr:8081/v1/",
    }

    
    console.debug("====== body:", body)
    
    // const processUrl = this.happyPipelineUrl+"process/"
    const processUrl = `${this.happyPipelineUrl}process/`

    console.log("CALL HAPPY PIPELINE /process/")
    fetch(processUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 
            'Content-type': 'application/json; charset=UTF-8',
            "Accept": "application/json",
            "User-Agent": "Zooprocess v10",
            "Authorization": bearer

        },
    })
    .then(async (response) => {
        console.debug("---------> response", response)
        if (! response.ok) {
            // console.log("reponse:",response.status)
            // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`)
            const text = await response.text();
            console.error("Error details:", text);
            // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
            return Promise.reject(`Cannot launch the task ${taskId} - Error: ${response.status}`);
        }
    return response.json()
    })

    }
    catch(error){
        return Promise.reject({message:"Cannot process the scan"})
    }



    
    // if ( scanInfo.type != "SCAN" ){
    //     console.log("scanInfo is not a scan")
    //     taskInstance.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is not a scan"})
    //     // return Promise.reject(`Cannot launch the task ${taskId} | Error: scanID ${scanInfo.id} is not a scan : ${scanInfo.type}`)
    //     throw new DataNotValidException(`Cannot launch the task ${taskId} | Error: scanID ${scanInfo.id} is not a scan : ${scanInfo.type}`)
    // }

    // const background = scanInfo.subsample.scan.find(scan => scan.type == "MEDIUM_BACKGROUND")
    // if ( background == null ){
    //     console.log("no background")
    //     taskInstance.setTaskStatus(taskId, {status:"FAILED",log:"no background"})
    //     // return Promise.reject(`Cannot launch the task ${taskId} - Error: there is no background - Error: ${JSON.stringify(scanInfo)}`)
    //     // return Promise.reject(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)
    //     // throw new Error(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)
    //     throw new MissingDataException(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)
    // }
    
    // taskInstance.setTaskStatus(taskId, {status:"RUNNING",log:"running"})

    // // determine path from project data
    // projectId = data.project

    // const body = {

    //     src: "srcpath",
    //     dst: "dstpath",
    //     scan: scanInfo.url,
    //     back: background.url,

    //     // scanId: data.params.scanId,
    //     taskId: taskId,
    //     bearer: bearer,
    //     db: "http://zooprocess.imev-mer.fr:8081/v1/",
    // }

    
    // console.debug("body:", body)
    
    // // const processUrl = this.happyPipelineUrl+"process/"
    // const processUrl = `${this.happyPipelineUrl}process/`

    // console.log("CALL HAPPY PIPELINE /process/")
    // fetch(processUrl, {
    //     method: 'POST',
    //     body: JSON.stringify(body),
    //     headers: { 
    //         'Content-type': 'application/json; charset=UTF-8',
    //         "Accept": "application/json",
    //         "User-Agent": "Zooprocess v10",
    //         "Authorization": bearer

    //     },
    // })
    // .then(async (response) => {
    //     console.debug("---------> response", response)
    //     if (! response.ok) {
    //         // console.log("reponse:",response.status)
    //         // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`)
    //         const text = await response.text();
    //         console.error("Error details:", text);
    //         // return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
    //         return Promise.reject(`Cannot launch the task ${taskId} - Error: ${response.status}`);
    //     }
    // return response.json()
    // })
    // .then((json) => console.log(json))
    // .catch(error => {
    //     console.log(error)
    //     return new Promise().reject(`Cannot launch the task ${taskId} | Error: ${error}`)
    // })

    const url = `${this.zooProcessApiUrl}task/${taskId}`
    const message = `Launched | Take a look at ${url}`

    const returndata = {
    //     status:200,
    //     data: { message }
        message,
        url,
        taskId
    }
    // console.log("returndata", returndata)
    // console.log("message", message)
    //return new Promise().resolve(message)
    // return returndata
    // return new Promise().resolve(message)
    // return message

    // return new Promise(function(resolve, reject) {
    //     // return resolve(message)
    //     return resolve(returndata)
    // })
    return Promise.resolve(returndata)
}

}

module.exports = { Process } 
