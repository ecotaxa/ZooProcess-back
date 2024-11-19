
import { Task } from "@prisma/client";
// import {Process} from "./process";
import TaskStrategy from "./TaskStrategy";

class VignetteStrategy extends TaskStrategy {
    async execute(task: Task, bearer: string): Promise<any> {

        // return process(task, bearer);
        // const process = new Process()
        // return await this.process(task, bearer)
        // return await process.process(task, bearer,this)

        return {meesage:'TODO'}
    }
}



export default VignetteStrategy

