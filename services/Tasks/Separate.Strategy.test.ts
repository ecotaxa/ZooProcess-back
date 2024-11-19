import { Task } from '@prisma/client';
import SeparateStrategy from './SeparateStrategy';

describe('SeparateStrategy', () => {
    it('should execute task separation successfully with valid task and bearer', async () => {
        const mockTask = {
            id: '1',
            name: 'Test Task',
            exec: 'SEPARATE' as const,
            params: {},
            log: null,
            percent: 0,
            status: 'PENDING' as const,
            createdAt: new Date(),
            updatedAt: new Date()
        } as Task;
        const mockBearer = 'validBearerToken';
        const mockSeparate = jest.fn().mockResolvedValue('separationSuccess');

        const separateStrategy = new SeparateStrategy({ separate: mockSeparate } as any);
        const result = await separateStrategy.execute(mockTask, mockBearer);

        expect(mockSeparate).toHaveBeenCalledWith(mockTask, mockBearer);
        expect(result).toBe('separationSuccess');
    });});
