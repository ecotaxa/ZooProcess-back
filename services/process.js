// const background = require('../routes/background');
const { Background } = require('./background');


// const { Prisma } = require('./client');


class Process {

//TODO mettre ça en un endroit unique car il y a des copies
zooProcessApiUrl = "http://zooprocess.imev-mer.fr:8081/v1/"
happyPipelineUrl = 'http://zooprocess.imev-mer.fr:8000/'

async process(data, bearer,taskInstance){

    console.log("tasks::process data:", data)
    console.log("tasks::process bearer:", bearer)

    const taskId = data.id
    console.debug("process - taskId:",taskId)
    taskInstance.setTaskStatus(taskId, {status:"ANALYSING",log:"analysing"})

    const scanInfo = await new Background().findScan(data.params.scanId)

    if ( scanInfo == null){
        console.log("scanInfo is null")
        taskInstance.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is null"})
        return Promise.reject(`Cannot launch the task ${taskId} | Error: there is no scan with id ${data.params.scanId}`)
    }

    console.debug("scanInfo", scanInfo)
    
    if ( scanInfo.type != "SCAN" ){
        console.log("scanInfo is not a scan")
        taskInstance.setTaskStatus(taskId, {status:"FAILED",log:"scanInfo is not a scan"})
        return Promise.reject(`Cannot launch the task ${taskId} | Error: scanID ${scanInfo.id} is not a scan : ${scanInfo.type}`)
    }

    const background = scanInfo.SubSample.scan.find(scan => scan.type == "BACKGROUND")
    if ( background == null ){
        console.log("no background")
        taskInstance.setTaskStatus(taskId, {status:"FAILED",log:"no background"})
        // return Promise.reject(`Cannot launch the task ${taskId} - Error: there is no background - Error: ${JSON.stringify(scanInfo)}`)
        return Promise.reject(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)

    }
    
    taskInstance.setTaskStatus(taskId, {status:"RUNNING",log:"running"})

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

    
    console.debug("body:", body)
    
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
