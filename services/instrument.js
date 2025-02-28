const { Prisma } = require('./client')

module.exports.Instrument = class {

    constructor(){
        this.prisma = new Prisma().client;
    }

    async findAll(queryparams) {
        const {full } = queryparams

        let query = {
            orderBy:{
                name: 'asc'
            }
        }
        if (full){
            query.include = {
                ZooscanCalibration: {
                    orderBy:{
                        frame: 'asc'
                    }
                }
            }
        }
        // const instruments = await this.prisma.instrument.findMany({
        //     orderBy:{
        //         name: 'asc'
        //     },
        //     include:{
        //         ZooscanCalibration: {
        //             orderBy:{
        //                 frame: 'asc'
        //             }
        //         }
        //     }
        // })
        const instruments = await this.prisma.instrument.findMany(query)
        return instruments
    }


  
  
   
    async get2(instrumentId,archived) {
        const query = {
            where:{
                id:instrumentId
            },
                include: {
                ZooscanCalibration: {
                    // where: { archived: false },
                    orderBy: {
                        // frame: 'asc',
                        archived: 'asc'
                    }
                }
            }
        };
    
        try {
            const instrument = await this.prisma.instrument.findUnique(query);
    
            console.log("instrument", instrument);
    
            return instrument;
        } catch (error) {
            console.error("Error fetching instrument:", error);
            throw new Error("Failed to fetch instrument");
        }
    }
    
   

    async get(instrumentId,archived){

        let include = {
            ZooscanCalibration: {
                // where:{ archived:t },
                orderBy:{
                    frame: 'asc',
                }
            },
        }



        const instrument = await this.prisma.instrument.findUnique({
            where:{
                id:instrumentId
            },
            include
        })

        console.log("instrument", instrument)

        if (archived != undefined){
            instrument.ZooscanCalibration = instrument.ZooscanCalibration.filter(calibration => calibration.archived == archived)
        }

        return instrument
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

    // async get(instrumentId, archived) {
    //     let include = {
    //         ZooscanCalibration: {
    //             orderBy: {
    //                 frame: 'asc'
    //             }
    //         },
    //         ZooscanCalibration: true,
    //     };
    
    //     if (archived === false) {
    //         include.ZooscanCalibration = {
    //             where: { archived: false },
    //             orderBy: {
    //                 frame: 'asc',
    //             }
    //         };
    //     }
    
    //     const instrument = await this.prisma.instrument.findUnique({
    //         where: {
    //             id: instrumentId
    //         },
    //         include,
    //     });
    
    //     console.log("instrument", instrument);
    
    //     return instrument;
    // }
    

    // async get(instrumentId) {
    //     const query = {
    //         id: instrumentId,
    //         include: {
    //             ZooscanCalibration: {
    //                 where: { archived: false },
    //                 orderBy: {
    //                     frame: 'asc',
    //                 }
    //             }
    //         }
    //     };
    
    //     const instrument = await this.prisma.instrument.findUnique(query);
    
    //     console.log("instrument", instrument);
    
    //     return instrument;
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
