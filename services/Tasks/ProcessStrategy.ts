
import { Scan, Task } from "@prisma/client";
// import { Process } from "./process";




// import { MissingDataException } from '../../exceptions/MissingDataException';

// import TaskStrategy, { ITaskStrategy } from "./TaskStrategy";
import TaskStrategy from "./TaskStrategy";
// import { Tasks } from "./tasks";
// import { Tasks } from "./Tasks";


// import { TaskStatus } from "./TaskStatus";
import { ScanType } from "@prisma/client";

// import { Background } from "../background";
// const { Background } = require("../services/background");
// const { Background } = require("../background");
const container = require('../container');
// import { container } from "../container";


import { TaskStatus as ETaskStatus } from "@prisma/client";
import MissingDataException from "../../exceptions/MissingDataException";

export default class ProcessStrategy extends TaskStrategy {
// class ProcessStrategy implements ITaskStrategy {   
    
    // taskInstance: TaskStatus;
    // happyPipelineUrl: any;
    // zooProcessApiUrl: any;

    constructor(tasks: Tasks) {
        console.debug("ProcessStrategy::constructor()");
        super(tasks);
        // this.taskInstance = new TaskStatus()
    }


    // async execute(task: Task, bearer: string): Promise<any> {
    //     // const process = new Process();
    //     // return await process.run(task, bearer, this);
    //     return await this.run(task, bearer);
    // }


    // a = ETaskStatus.ANALYSING.toString()
    
async run(data: any, bearer: string) {
    console.log("tasks::processStrategy data:", data)
    console.log("tasks::process bearer:", bearer)

    const taskId = data.id
    console.debug("process - taskId:", taskId)

    

    // const scanInfo = await new Background().findScan(data.params.scanId)
    const backgroundInstance = container.get("background")
    // const scanInfo = await new backgroundInstance.findScan(data.params.scanId)
    const scanInfo = await backgroundInstance.findScan(data.params.scanId)

    if (scanInfo == null) {
        console.log("scanInfo is null")
        this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "scanInfo is null" })
    }

    console.debug("-------------------->>>>>>>>>>")
    console.debug("scanInfo", scanInfo)

    if (scanInfo.type != "SCAN") {
        console.log("scanInfo is not a scan")
        this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "scanInfo is not a scan" })
    }

    // console.debug("*scanInfo:", scanInfo)
    console.debug("*-> scanInfo.subsample:", scanInfo.subsample)
    console.debug("*-> scanInfo.subsample.scan:", scanInfo.subsample.scan)


    const background: Scan = scanInfo.subsample.scan.find((scan:any) => scan.type == ScanType.MEDIUM_BACKGROUND)
    if (background == null) {
        this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "no background" })
        // return Promise.reject(`Cannot launch the task ${taskId} there is no background | Error: ${scanInfo}`)
        // return Promise.reject({message:`Cannot launch the task ${taskId} there is no background`, stack:JSON.stringify(scanInfo, null, 2)})
        // throw new MissingDataException(`Cannot launch the task ${taskId} | Error: there is no scan with id ${data.params.scanId}`)
        throw new MissingDataException(`Cannot launch the task ${taskId} : there is no background associated to scan ${scanInfo.id}`)

    }

    this.taskInstance.setStatus(taskId, { status: ETaskStatus.RUNNING, log: "running" })

    const body = {
        src: "srcpath",
        dst: "dstpath",
        scan: scanInfo.url,
        back: background.url,
        taskId: taskId,
        bearer: bearer,
        db: this.zooProcessApiUrl,
    }

    console.debug("body:", body)

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
        if (!response.ok) {
            const text = await response.text();
            console.error("Error details:", text);
            return Promise.reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
        }
        return response.json()
    })

    const url = `${this.zooProcessApiUrl}task/${taskId}`
    const message = `Launched | Take a look at ${url}`

    const returndata = {
        message,
        url,
        taskId
    }

    return new Promise((resolve) => {
        resolve(returndata)
    })
}


}


// export default ProcessStrategy

