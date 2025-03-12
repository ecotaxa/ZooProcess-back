
const { PrismaClient } = require('@prisma/client');
// const { Samples } = require('./path/to/samples'); // Adjust the path as necessary
// const { SubSamples } = require('./path/to/subsamples'); // Adjust the path as necessary
// const Samples = require('./samples');
const { Samples } = require('./samples');

import { attendedSamples as attendedSamples, samples as mockedSamples } from "../tests/mocks/samples";


// const subsamples = require("../routes/subsamples");

// const mockedSamples= require('../tests/mocks/samples').samples;
// const { samples as mockedSamples } from '@tests/mocks/samples';

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => ({
        sample: {
            findMany: jest.fn()
        }
    }))
}));

describe('Samples', () => {
    let samplesInstance: any; // ISamples;
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = new PrismaClient();
        samplesInstance = new Samples();
        samplesInstance.prisma = prismaMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('test_findAll_returns_all_samples_with_associations', async () => {
        const projectId = "67aaeed26e63afed1ae341ce";
        const mockSamples = mockedSamples;

        prismaMock.sample.findMany.mockResolvedValue(mockSamples);

        const result = await samplesInstance.findAll(projectId);

        expect(prismaMock.sample.findMany).toHaveBeenCalledWith({
            where: { projectId },
            include: {
                metadataModel: true,
                subsample: { include: { scan: true } }
            }
        });
        // expect(result).toEqual(expect.arrayContaining(mockSamples));
        // expect(result).toEqual(expect.arrayContaining(attendedSamples));
        // expect(result[0].nbFractions).toEqual(attendedSamples[0].nbFractions)
        expect(attendedSamples[0].nbFractions).toEqual(result[0].nbFractions)
        
    });

    // test('test_findAll_no_samples_returns_empty_array', async () => {
    //     const projectId = 2;

    //     prismaMock.sample.findMany.mockResolvedValue([]);

    //     const result = await samplesInstance.findAll(projectId);

    //     expect(prismaMock.sample.findMany).toHaveBeenCalledWith({
    //         where: { projectId },
    //         include: {
    //             metadataModel: true,
    //             subsample: { include: { scan: true } }
    //         }
    //     });
    //     expect(result).toEqual([]);
    // });

    // test('test_findAll_correctly_calculates_fractions_and_scans', async () => {
    //     const projectId = 3;
    //     const mockSamples = [
    //         {
    //             id: 1,
    //             subsample: [
    //                 { scan: [{ createdAt: new Date('2023-01-01') }], createdAt: new Date('2023-01-01') },
    //                 { scan: [{ createdAt: new Date('2023-02-01') }], createdAt: new Date('2023-02-01') }
    //             ]
    //         }
    //     ];

    //     prismaMock.sample.findMany.mockResolvedValue(mockSamples);

    //     const result = await samplesInstance.findAll(projectId);

    //     expect(result[0].nbFractions).toBe(2);
    //     expect(result[0].nbScans).toBe(2);
    //     expect(result[0].createdAt).toEqual(new Date('2023-01-01'));
    //     expect(result[0].updatedAt).toEqual(new Date('2023-02-01'));
    // });
});