
import { Scan, Task } from "@prisma/client";
// import {Process} from "./process";
import TaskStrategy from "./TaskStrategy";
import { TaskStatus } from "./TaskStatus";
import { ScanType } from "@prisma/client";

import { TaskStatus as ETaskStatus } from "@prisma/client";
import MissingDataException from "../../exceptions/MissingDataException";

const container = require('../container');

class BackgroundStrategy extends TaskStrategy {

    // taskInstance: TaskStatus;
    
        constructor(tasks: Tasks) {
            console.debug("BackgroundStrategy::constructor()")
            super(tasks)
            // this.taskInstance = new TaskStatus()
        }

    // inherited from TaskStrategy
    // async execute(task: Task, bearer: string): Promise<any> {
    //     return await this.run(task, bearer);
    // }

    // async runold(data: any, bearer: string) {
    
    //     console.log("tasks::backgroundStrategy data:", data)
    //     console.log("tasks::background bearer:", bearer)
    
    //     const taskId = data.id
    //     console.debug("background - taskId:", taskId)

    //     const { project:projectId, instrumentId, background } = data.params
    //     console.debug("background - projectId:", projectId)
    //     console.debug("background - instrumentId:", instrumentId)
    //     console.debug("background - background:", background)

    //     const backgroundInstance = container.get("background")

    //     if (!background) {
    //         this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "no background" })
    //         throw new MissingDataException(`Cannot launch the task ${taskId} : there is no background`)
    //     }
    //     console.debug("background - background.length:", background.length)

    //     if (background.length !== 2) {
    //         this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "missing background" })
    //         throw new MissingDataException(`Cannot launch the task ${taskId} : backgrounds are missing`)
    //     }

    //     this.taskInstance.setStatus(taskId, { status: ETaskStatus.RUNNING, log: "running" })

    //     /*
    //     class Background(BaseModel):
    //         bearer: Union[str, None] = None
    //         db: Union[str, None] = None
    //         taskId: Union[str, None] = None
    //         projectId: str
    //         background: List[str]
    //         instrumentId: str
    //     */
    //     const body =  {
    //         bearer: bearer,
    //         db: this.zooProcessApiUrl,
    //         taskId: taskId,
    //         projectId: projectId,
    //         background: background,
    //         instrumentId: instrumentId
    //     }

    //     console.debug("body:", body)

    // const backgroundUrl = `${this.happyPipelineUrl}background/`

    // console.log("CALL HAPPY PIPELINE /background/" , backgroundUrl)
    // fetch(backgroundUrl, {
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
    //     console.debug("bg strat ---------> response", response)
    //     if (!response.ok) {
    //         const text = await response.text();
    //         console.error("Error details:", text);
    //         return Promise.reject(`Cannot launch the task ${taskId} | Error: ${response.status}`);
    //     }
    //     return response.json()
    // })
    // .catch((error) => {
    //     console.debug("bg strat")
    //     console.trace("Caught error:", error);
    //     console.error("Error launching the task:", error);
    //     // throw error;
    //     return Promise.reject(`Cannot launch the task ${taskId} | Error: ${error}`);
    // })

    // const url = `${this.zooProcessApiUrl}task/${taskId}`
    // const message = `Launched | Take a look at ${url}`

    // const returndata = {
    //     message,
    //     url,
    //     taskId
    // }

    // return new Promise((resolve) => {
    //     resolve(returndata)
    // })

    // }

    async run(data: any, bearer: string) {
        try {
            console.log("tasks::backgroundStrategy data:", data)
            console.log("tasks::background bearer:", bearer)
        
            const taskId = data.id
            console.debug("background - taskId:", taskId)
    
            const { project:projectId, instrumentId, background } = data.params
            console.debug("background - projectId:", projectId)
            console.debug("background - instrumentId:", instrumentId)
            console.debug("background - background:", background)
    
            const backgroundInstance = container.get("background")
    
            if (!background) {
                this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "no background" })
                throw new MissingDataException(`Cannot launch the task ${taskId} : there is no background`)
            }
            console.debug("background - background.length:", background.length)
    
            if (background.length !== 2) {
                this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: "missing background" })
                throw new MissingDataException(`Cannot launch the task ${taskId} : backgrounds are missing`)
            }
    
            this.taskInstance.setStatus(taskId, { status: ETaskStatus.RUNNING, log: "running" })
    
            const body = {
                bearer: bearer,
                db: this.zooProcessApiUrl,
                taskId: taskId,
                projectId: projectId,
                background: background,
                instrumentId: instrumentId
            }
    
            console.debug("body:", body)
    
            const backgroundUrl = `${this.happyPipelineUrl}background/`
    
            console.log("CALL HAPPY PIPELINE /background/" , backgroundUrl)
            
            try {
                const response = await fetch(backgroundUrl, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        "Accept": "application/json",
                        "User-Agent": "Zooprocess v10",
                        "Authorization": bearer
                    },
                });
                
                console.debug("bg strat ---------> response", response);
                
                if (!response.ok) {
                    const text = await response.text();
                    console.error("Error details:", text);
                    this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: `Error: ${response.status} - ${text}` });
                    throw new Error(`Cannot launch the task ${taskId} | Error: ${response.status}`);
                }
                
                const responseData = await response.json();
                
                const url = `${this.zooProcessApiUrl}task/${taskId}`;
                const message = `Launched | Take a look at ${url}`;
                
                return {
                    message,
                    url,
                    taskId
                };
                
            } catch (error:any) {
                console.debug("bg strat");
                console.trace("Caught error:", error);
                console.error("Error launching the task:", error);
                this.taskInstance.setStatus(taskId, { status: ETaskStatus.FAILED, log: `Error: ${error.message}` });
                throw new Error(`Cannot launch the task ${taskId} | Error: ${error.message}`);
            }
        } catch (error:any) {
            console.error("Error in BackgroundStrategy.run:", error);
            // Make sure to update task status if not already done
            if (data && data.id) {
                this.taskInstance.setStatus(data.id, { status: ETaskStatus.FAILED, log: `Error: ${error.message}` });
            }
            throw error; // Re-throw to be handled by the caller
        }
    }
    
    
}


export default BackgroundStrategy

