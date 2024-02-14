const { Prisma } = require('./client')

module.exports.Instrument = class {

    constructor(){
        this.prisma = new Prisma().client;
    }

    async findAll(){
        const instruments = await this.prisma.instrument.findMany({})
        return instruments
    }

    async get(instrumentId){
        const instrument = await this.prisma.instrument.findUnique({
            where:{
                id:instrumentId
            }
        })
        return instrument
    }

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