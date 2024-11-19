import { Task } from "@prisma/client";
import TaskStrategy from "./TaskStrategy";

class SeparateStrategy extends TaskStrategy {
    async execute(task: Task, bearer: string): Promise<any> {
        return this.execute(task, bearer);
    }
}

export default SeparateStrategy
