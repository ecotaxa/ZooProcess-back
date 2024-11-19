import { Task } from "@prisma/client";
import { Tasks } from "./tasks";
// import { Tasks } from "./tasks";

interface ITaskStrategy {
    execute(task: Task, bearer: string): Promise<any>;
}

class TaskStrategy implements ITaskStrategy {
    constructor(protected tasks: Tasks) {}
    async execute(task: Task, bearer: string): Promise<any> {
        throw new Error('Method not implemented');
    }
}

export default TaskStrategy
