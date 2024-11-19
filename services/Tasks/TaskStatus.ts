import { PrismaClient, Task, Prisma } from '@prisma/client';

// type TaskStatusInput = Prisma.TaskStatusUpdateInput;

import { TaskStatus as PrismaTaskStatus } from '@prisma/client';


interface TaskStatusData {
    status: PrismaTaskStatus;
    log: string;
}
export class TaskStatus {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async setStatus(taskId: string, data: TaskStatusData): Promise<Task> {
        return this.prisma.task.update({
            where: { id: taskId },
            data: { 
                status: data.status,
                log: data.log
            }
        });
    }
}
