
const { Prisma } = require("./client");


module.exports.Qc = class {


    constructor(){  
        this.prisma = new Prisma().client;
    }

    // async newQC(project,subSample) {

    //     const qc = {
    //         //projectId: project.id,
    //         //subSampleId: subSample.id,
    //         qCStateItemId: ""
    //     }

    //     console.log("QC new create", qc);

    //     return this.prisma.qc.create({
    //         data:qc
    //     })
    // }

    async create(qc) {

        console.log("QC create", qc);

        return this.prisma.qCState.create({
            data:qc
        })
    }

}