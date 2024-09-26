const { Prisma } = require('./client')

module.exports.Instrument = class {

    constructor(){
        this.prisma = new Prisma().client;
    }

    async findAll(){
        const instruments = await this.prisma.instrument.findMany({
            orderBy:{
                name: 'asc'
            }
        })
        return instruments
    }


  
  

    async get(instrumentId){
        const instrument = await this.prisma.instrument.findUnique({
            where:{
                id:instrumentId
            },
            include:{
                ZooscanCalibration: {
                    orderBy:{
                        frame: 'asc'
                    }
                },
                ZooscanCalibration: true,

            }
        })

        // const calibration = await this.prisma.zooscanCalibration.findFirst({
        //     where:{
        //         instrumentId: instrumentId
        //     },
        //     select:{
        //         id: true,
        //         instrumentId: false,
        //         xOffset: true,
        //         yOffset: true,
        //         xSize: true,
        //         ySize: true,
        //     }
        // })

        // const instrumentWithCalibration = {
        //    ...instrument,
        //     calibration
        // }

        console.log("instrument", instrument)

        return instrument
        // return instrumentWithCalibration
    }

    // async getZooscanCalibrations(instrumentId){
    //     const instrument = await this.prisma.zooscanCalibration.findFirst({
    //         where:{
    //             id:instrumentId
    //         },
    //         include:{
    //             zooscanCalibrations: true
    //         }
    //     })
    //     return instrument
    // }


    async add(data){
        const instrument = this.prisma.instrument.create({data:data})
        return instrument
    }
    
    async update(instrumentId, data){
        const instrument = await this.prisma.instrument.update({
            where:{
                id:instrumentId
            },
            data:data
        })
        return instrument
    }

    async delete(instrumentId){
        const instrument = await this.prisma.instrument.delete({
            where:{
                id:instrumentId
            }
        })
        return instrument
    }
}