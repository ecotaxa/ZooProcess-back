
const fs = require('fs');
const path = require('path');

const { SubSamples } = require('./subsamples');


module.exports.Process = class {

    constructor() {
      // this.prisma = new PrismaClient()
      // this.prisma = new Prisma().client;
    //   this.projects = new Projects()
      this.subsamples = new SubSamples()
    }

    async subsample(subsampleId){

        const subsample = await this.subsamples.get({subSampleId:subsampleId})
        console.log("subsample", subsample)
        
        if (subsample == null) {
            console.error("subsample not found")
            return Promise.reject("subsample not found")
        }

        const data = {
            state : "PROCESSING",
        }

        return Promise.resolve(data)

    }


}
