



const { Prisma } = require('./client')

module.exports.Calibration = class {

    constructor(){
        this.prisma = new Prisma().client;
    }

    async findAll(instrumentId){
        const calibrations = await this.prisma.zooscanCalibration.findMany({
            where:{
                instrumentId:instrumentId
            },
            orderBy:{
                frame: 'asc'
            }
        })
        return calibrations
    }


    async get(calibrationId){
        const calibration = await this.prisma.ZooscanCalibration.findUnique({
            where:{
                id:calibrationId
            },
        })

        console.log("calibration", calibration)

        return calibration
    }


    async add(data){
        const instrument = this.prisma.zooscanCalibration.create({data:data})
        return instrument
    }

    // async update({body, projectId}) {
    //     return this.projects.update({body, projectId})
    //   }
    async update({calibrationId, data}){

        let dat = {...data} //, updatedAt: new Date()}
            dat.id = undefined
        const calibration = await this.prisma.zooscanCalibration.update({
            where:{
                id:calibrationId
            },
            data:dat
        })
        return calibration
    }

    async delete(calibrationId){
        const calibration = await this.prisma.zooscanCalibration.delete({
            where:{
                id:calibrationId
            }
        })
        return calibration
    }
    

}