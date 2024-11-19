
import { Scan, Task } from "@prisma/client";
// import { Process } from "./process";




import TaskStrategy from "./TaskStrategy";
import { Tasks } from "./tasks";
import { TaskStatus } from "./TaskStatus";
import { ScanType } from "@prisma/client";

// import { Background } from "../background";
// const { Background } = require("../services/background");
const { Background } = require("../background");


import { TaskStatus as ETaskStatus } from "@prisma/client";

class ProcessStrategy extends TaskStrategy {
    taskInstance: TaskStatus;
    happyPipelineUrl: any;
    zooProcessApiUrl: any;

    constructor(tasks: Tasks) {
        super(tasks)
        this.taskInstance = new TaskStatus()
    }


    async execute(task: Task, bearer: string): Promise<any> {
        // const process = new Process();
        // return await process.run(task, bearer, this);
        return await this.run(task, bearer);
    }


    a = ETaskStatus.ANALYSING.toString()
    
async run(data: any, bearer: string) {
    console.log("tasks::process data:", data)
    console.log("tasks::process bearer:", bearer)

    const taskId = data.id
    console.debug("process - taskId:", taskId)

    

    const scanInfo = await new Background().findScan(data.params.scanId)

    if (scanInfo == null) {
        console.log("scanInfo is null")
        this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "scanInfo is null" })
    }

    console.debug("scanInfo", scanInfo)

    if (scanInfo.type != "SCAN") {
        console.log("scanInfo is not a scan")
        this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "scanInfo is not a scan" })
    }

    const background: Scan = scanInfo.SubSample.scan.find((scan:any) => scan.type == ScanType.BACKGROUND)
    if (background == null) {
        this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "no background" })
        return Promise.reject(`Cannot launch the task ${taskId} there is no background | Error: ${scanInfo}`)
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
}}


export default ProcessStrategy

