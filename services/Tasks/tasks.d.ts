import { Task } from '@prisma/client';

declare module './tasks';

export class Tasks {
    separate(task: Task, bearer: string): Promise<any>;
    process(task: Task, bearer: string): Promise<any>;
}
