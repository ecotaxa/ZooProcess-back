import { Task } from "@prisma/client";
import { TaskStatus } from "./TaskStatus";
// import { Tasks } from "./Tasks";
// import { Tasks } from "./tasks";

export interface ITaskStrategy {
    execute(task: Task, bearer: string): Promise<any>;
}

class TaskStrategy implements ITaskStrategy {

    protected taskInstance: TaskStatus;
    protected zooProcessApiUrl: string;
    protected happyPipelineUrl: string;



    constructor(protected tasks: Tasks) {
        this.zooProcessApiUrl = process.env.SERVER_URL || "http://localhost:8081";
        this.happyPipelineUrl = process.env.HAPPY_PIPELINE_URL || "http://localhost:8080";
        this.taskInstance = new TaskStatus()
    }
    // async execute(task: Task, bearer: string): Promise<any> {
    //     throw new Error('Method not implemented');
    // }

          async execute(task: Task, bearer: string): Promise<any> {
          console.debug(`Executing ${task.exec} task with ID: ${task.id}`);
        
          try {
              const result = await this.run(task, bearer);              
              console.debug(`Task ${task.id} executed successfully`);
              
              return result;
          } catch (error) {
              console.error(`Error executing task ${task.id}:`, error);
              throw error;
          }
    }
    
    // This method should be overridden by subclasses
    async run(task: Task, bearer: string): Promise<any> {
        throw new Error('Method not implemented');
    }
}

export default TaskStrategy
