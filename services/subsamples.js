// const { PrismaClient } = require("@prisma/client");
const { UserRole } = require("@prisma/client");
const { Prisma } = require("./client");
const { Scans } = require("./prisma/scans");
// const { Scans } = require("./scans");

const {Users} = require("./users");

module.exports.SubSamples = class {

    constructor(){

        // this.prisma = new PrismaClient({
        //     log: ['query'],
        //   })
        // this.prisma = new PrismaClient()
        
        this.prisma = new Prisma().client;
    }

    async findAll({projectId, sampleId}) {
        // SampleView

        console.log("SubSamples findAll projectId= ", projectId);
        console.log("SubSamples findAll sampleId= ", sampleId);

        // const samples = await this.prisma.subSample.findMany({
        // })
        const samples = await this.prisma.subSample.findMany({
            where:{
                sampleId
            },
            include:{
                metadata:true,
                metadataModel:true,
                // metadataModelId:false,
                scan:true,
                user:true,
            }
        })

        // console.log("Sample:", samples)

        // const nsamples = samples.map((sample) => {

        //     // console.log("MAP sample: ", sample);

        //     const nbFractions = sample.subsample.length;
        //     let nbScans = 0
        //     if ( nbFractions > 0 ) {
        //         nbScans = sample.subsample
        //         .flatmap((subsample) => subsample.scans.length )
        //         .reduce((a, b)=> a + b, 0);
        //     }

        //     const ns = {
        //         ...sample,
        //         nbFractions,
        //         nbScans
        //     }
        //     return ns;
        // })

        // const nsamples = {
        //     ...samples,
        //     count:3
        // }

        // console.log("nsamples: ", nsamples);

        // return nsamples
        return samples
    }

    // async get({/*projectId, sampleId,*/ subSampleId}) {
    async get({projectId, sampleId, subSampleId}) {
            console.debug("SubSamples get projectId= ", projectId);
            console.debug("SubSamples get sampleId= ", sampleId);
            console.debug("SubSamples get subSampleId= ", subSampleId);

            const sample = await this.prisma.subSample.findFirst({
            where:{
                id:subSampleId,
                //projectId:projectId
            },
            include:{
                scan:true,
                metadata:true,
                metadataModel:true,
                user:true,
                // subsample:true
                sample: {
                    include: {
                        metadata: true,
                    }
                },
                qc: true
            }
        })
        return sample
    }

    
    metadata2Array(metadata){

        const metadataArray = Object.keys(metadata).map( (elem) => {

            let data = {
                name:elem,
                value:String(metadata[elem]),
                type:typeof(metadata[elem])
            }

            return data;
        });

        console.log('metadataArray:', metadataArray);
        return metadataArray
    }




    async add({projectId, sampleId, subsample}) {

        console.log("add subsample: ", {projectId, sampleId, subsample});

        const metadataArray = this.metadata2Array(subsample.data)

        // pass the class instance or put this code in the class ? that's the question
        const adduser = async (userInst,name) => { 
            console.log("adduser: ", name);
            const userData = {
                name,
                email: name + '@invalid.com', // invalid.com officially reserved domain by IANA specifically for testing and documentation purposes
                password : Math.random().toString(36).slice(-8),
                role: UserRole.INACTIVE_USER
            }
            try {
                const user = await userInst.add(userData)
                console.log("user: ", user);
                return user.id
            }
            catch (error) {
                console.error("Error adding user: ", error)
                // if ( error.code == 'P2025' ){
                //     // throw ("User not found")
                //     throw ("Error: Cannot determine the operator")
                // } else {
                    throw error
                // }
            }
        }

        let userId = undefined;
        if ( subsample.user_id != null){
            userId = subsample.user_id;
        } else {
            let userFound = false
            console.debug("No user_id, searching user by scanning_operator")
            if ( !subsample.data || !subsample.data.scanning_operator ){
                    // need to go out the function
                    throw ("Error: the data have no operator")
            }
            const userInst = new Users();
            try {
                if ( subsample.data && subsample.data.scanning_operator ){
                    console.debug("Call Users(", subsample.data.scanning_operator, ")")
                    console.debug("Users instanciated")
                    userId = await userInst.search(subsample.data.scanning_operator)
                } 
                // else {
                //     // need to go out the function
                //     throw ("Error: the data have no operator")
                // }
            }
            catch ( error ) {
            //     console.error("Error during searching user: ", e)
            //     // IDEA use the user ID stored in the bearer token
            //     throw e
            // }    

                console.error("Error search user on full name",subsample.data.scanning_operator,":",error);
                userFound = false

            const split = subsample.data.scanning_operator.split('_')
            if ( split.length > 1 ){
                try {
                    userId = await userInst.search(split[0])
                    // return userId
                    userFound = true
                }
                catch ( error ) {
                    console.error("Error search user with prefix",split[0],":",error);
                    userFound = false
                }

                if ( userFound == false ){
                    try {
                        userId = await userInst.search(split[1])
                        // return userId
                        userFound = true
                    }
                    catch (error) {
                        console.error("Error search user with suffix",split[1],":",error);

                        // try {
                            userId = await adduser(userInst,subsample.data.scanning_operator)
                        // }
                        // catch(error) {
                        //     console.error(error);
                        //     if ( error.code == 'P2025' ){
                        //         // throw ("User not found")
                        //         throw ("Error: Cannot determine the operator")
                        //     } else {
                        //         throw error
                        //     }
                        // }
                    }
                }
            } // split.length > 1
            else {
                // const message = "User not found: " + subsample.data.scanning_operator
                // throw (message)
                console.error("User not found: ", subsample.data.scanning_operator);
                userId = await adduser(userInst,subsample.data.scanning_operator)
            }
        }

        // if ( subsample.user_id == null && subsample.data && subsample.data.scanning_operator ){
        //     const user = await this.prisma.user.findFirstOrThrow(
        //     {
        //     where:{
        //         name: subsample.data.scanning_operator
        //     }
        //     });
        //     userId = user.id;
        // } else {
        //     userId = subsample.user_id;
        // }
        }

        const data = {
            // name:sample.name,
            // sample:{
            //     connect: {
            //         sampleId
            //     }
            // },
            sampleId,
            userId: userId,
            metadata:{
                // create: metadataArray // simplement ou en desctructurer ci-dessous
                create: [
                        ...metadataArray
                    ]   
            }
        }

        console.log("SubSamples add data: ", data)

        if (subsample.name){data['name']=String(subsample.name)}
        if (subsample.metadataModelId){data['metadataModelId']=subsample.metadataModelId}

        console.log("Create: ", data);

        return await this.prisma.subSample.create({data})
      }
    


    async deleteSubSample({projectId, sampleId, subSampleId}) {

        console.log("deleteSubSample: ", {projectId, sampleId, subSampleId});

        return await this.prisma.subSample.delete({
            where:{
                id:subSampleId,
                //projectId:projectId
            }
        });
    }


    async deleteAll({sampleId}) {

        console.debug("SubSamples deleteAll")

        // delete associated scans
        const scan = new Scans()
        await scan.deleteAll({sampleId})

        const samples = await this.prisma.subSample.findMany({
            where:{
                sampleId
            }
        })

        // delete the metadata
        await this.prisma.metadata.deleteMany({
            where:{
                subSampleId:{
                    in:samples.map(sample => sample.id)
                }
            }
        })

        // delete itself
        await  this.prisma.subSample.deleteMany({
            where:{
                sampleId
            }
        })

    }

    // async process(){
    //     console.log("service::subsamples:process()")
    //     // return new Promise(function(resolve, reject) {
    //         // // return resolve(message)
    //         // const data = {
    //         //     "mask" : "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_msk1.gif",
    //         //     "out" : "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_out1.gif",
    //         //     "vis" :  "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_vis1.tif",
    //         //     "log" :  "/demo/Zooscan_iado_wp2_2023_sn002/Zooscan_scan/_work/t_17_2_tot_1/t_17_2_tot_1_log.txt",

    //         // }
    //         // return resolve(data)


    //         const sample = await this.prisma.subSample.findFirst({
    //             where:{
    //                 id:subSampleId,
    //                 //projectId:projectId
    //             },
    //             include:{
    //                 scan:true,
    //             }
    //         })

    //         const data



    //         return new Promise(function(resolve, reject) {
    //         return resolve(data)





    //     })
    // }


}
