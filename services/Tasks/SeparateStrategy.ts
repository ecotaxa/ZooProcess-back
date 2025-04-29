import { Task } from "@prisma/client";
import TaskStrategy, { ITaskStrategy} from "./TaskStrategy";

class SeparateStrategy extends TaskStrategy {
// class SeparateStrategy implements ITaskStrategy {   
    async execute(task: Task, bearer: string): Promise<any> {
        return this.execute(task, bearer);
    }
}

export default SeparateStrategy

