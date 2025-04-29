// const { PrismaClient } = require("@prisma/client");
const subsamples = require("../routes/subsamples");
const { Prisma } = require("./client");
// var flatMap = require('array.prototype.flatmap');

const { SubSamples } = require("./subsamples");

module.exports.Samples = class {

    constructor(){

        // this.prisma = new PrismaClient({
        //     log: ['query'],
        //   })
        // this.prisma = new PrismaClient()
        
        this.prisma = new Prisma().client;
    }


    remap_sample(sample) {
        if (!sample) return null;


        return {
  
              ...sample,
              subsample: sample.subsample?.map(sub => {
                  const { scanSubsamples, ...subsampleData } = sub;
                  return {
                      ...subsampleData,
                      scan: scanSubsamples?.map(ss => ss.scan)
                  }
              }) || []
      }
    }


    async deleteAll(projectId) {

        console.debug("Samples deleteAll")

        ///TODE need to remove the subsample


        const samples = await this.prisma.sample.findMany({
            // const samples = await this.prisma.sampleview.findMany({
                where:{
                    projectId:projectId
                },
                include:{
                    metadata:true,
                    metadataModel:true,
                    subsample:true
                }
            })

            // console.debug("samples:", samples)

            await this.prisma.metadata.deleteMany({
                where:{
                    sampleId:{
                        in:samples.map(sample => sample.id)
                    }
                }
            })


            const subSamples = new SubSamples()

            const sampleIDs = samples.map(sample => { return sample.id })
            
            await subSamples.deleteAll(sampleIDs)

            // await  this.prisma.subSample.deleteMany({
            //     where:{
            //         sampleId:{
            //             in:samples.map(sample => sample.id)
            //         }
            //     }
            // })

        console.debug("Samples deleteAll")
        
        await this.prisma.sample.deleteMany({
            where:{
                projectId:projectId
            } 
        })

        console.debug("Samples deleteAll")

    }

    async findAll(projectId) {
        // SampleView

        console.log("Samples findAll projectId= ", projectId);

        const samples = await this.prisma.sample.findMany({
        // const samples = await this.prisma.sampleview.findMany({
            where:{
                projectId:projectId
            },
            include:{
                // metadata:true,
                metadataModel:true,
                subsample:{
                    include:{
                        metadata:true,
                        // scan:true # with m2n can do that , need to use scanSubsamples
                    }
                }
            }
        })

        console.log("Sample:", samples)

        // return samples

        const nsamples = samples.map((sample) => {

            // console.log("MAP sample: ", sample);

            // make an array of all the  the suffix formed by the subsample names where i remove the sample name
            const fracids = sample.subsample.map(subsample => {
                const name = subsample.name;
                const suffix = name.replace(sample.name, "");
                const fracid = suffix.split("_")[1];
                return fracid;
            });
            // const subsampleNames = sample.subsample.map(subsample => subsample.name);


            // const nbFractions = "d1,d2 todo" // sample.subsample.length; // doit etre du style d1, d2
            // const nbFractions = fracids
            let nbScans = 0

            // if ( nbFraction > 0 ) {
            if ( fracids.length > 0 ) {
                    //  determine the number of scans
                const flattenedData = sample.subsample.flatMap(subsample => subsample.scan);
                nbScans = flattenedData.length;
            }

            const oldestCreatedAt = sample.subsample.reduce((acc, item) => {
                if (item.createdAt && acc < item.createdAt) {
                  return item.createdAt;
                }
                return acc;
              }, new Date("1970-01-01T00:00:00Z"));

              const mostRecentCreatedAt = sample.subsample.reduce((acc, item) => {
                if (item.scan && item.scan.length > 0) {
                  const latestScan = item.scan.reduce((latest, scanItem) => {
                    if (scanItem.createdAt && latest < scanItem.createdAt) {
                      return scanItem.createdAt;
                    }
                    return latest;
                  }, new Date("1970-01-01T00:00:00Z"));
                  return latestScan > acc ? latestScan : acc;
                }
                return acc;
              }, new Date("1970-01-01T00:00:00Z"));

            const ns = {
                ...sample,
                nbFractions: fracids.join(", "),
                nbScans,
                createdAt : oldestCreatedAt,
                updatedAt: mostRecentCreatedAt
            }
            return ns;
        })

        // const nsamples = {
        //     ...samples,
        //     count:3
        // }

        console.debug("nsamples: ", JSON.stringify(nsamples,null,2));

        // return nsamples
        const transformedSamples = nsamples.map(this.remap_sample)
        console.log("transformedSamples:",transformedSamples)
        return transformedSamples
    }

    async get({projectId, sampleId}) {
        const sample = await this.prisma.sample.findFirst({
            where:{
                id:sampleId,
                //projectId:projectId
            },
            include:{
                metadata:true,
                metadataModel:true,
                project:{
                    include:{
                        instrument:true,
                    }
                },
                // subsample:true
                subsample: {
                    include:{
                        // scan:true,
                        metadata:true,
                        user:true,
                        qc:true,
                        scanSubsamples: {
                            include:{
                                scan: true
                            }
                        
                        }
                    }
                }
            }
        })
        // return sample

        // console.debug("sample:",sample)
        console.debug("sample", JSON.stringify(sample,null,2))
        // console.debug("samples[0]:", sample.subsamples[0])
        // console.debug("scanSubsamples:", sample.subsamples[0].scanSubsamples)

        const transformedSample = this.remap_sample ( sample )

        console.debug("transformedSample: ", JSON.stringify(transformedSample,null,2));

        return transformedSample
    }



    // convert metadata object to array of metadata
    metadata2Array(metadata) {
        console.debug("metadata2Array metadata: ", metadata);
    
        const metadataArray = Object.keys(metadata).map((elem) => {
            console.debug("metadata2Array elem: ", elem);
            let value;
    
            if (typeof metadata[elem] === 'number') {
                console.debug('typeof(metadata[elem]) == number');
                value = String(metadata[elem]);
            } else if (typeof metadata[elem] === 'object') {
                console.debug('typeof(metadata[elem]) == object');
                value = JSON.stringify(metadata[elem]);
            } else {
                value = String(metadata[elem]);
            }
    
            let data = {
                name: elem,
                value,
                type: typeof metadata[elem]
            };
    
            return data;
        });
    
        console.log('metadataArray:', metadataArray);
        return metadataArray;
    }


    async add({projectId, sample}) {

        console.log("add sample: ", {projectId, sample});

        // const project = await this.prisma.project.findFirst({
        //     where:{
        //         id:projectId
        //     }
        // })
        // if ( project == null ) { throw()}
        // const data = {
        //     ...sample,
        //     projectId:project.id
        // }
        // console.log("Project: ", project )

        const metadataArray = this.metadata2Array(sample.data)

        const data = {
            // name:sample.name,
            projectId:projectId,
            metadata:{
                // create: metadataArray // simplement ou en desctructurer ci-dessous
                create: [
                        ...metadataArray
                    ]   
            }
        }

        if (sample.name){data['name']=sample.name}
        if (sample.metadataModelId){data['metadataModelId']=sample.metadataModelId}

        console.log("Create: ", data);

        return await this.prisma.sample.create({data})
      }
    
    //   type Metadata = {
    //     id: number;
    //     name: string;
    //     value: string;
    //     type: string; 
    //   };

    //   async updateMetadata(id,value,type){
    async updateMetadata(meta/*:Metadata*/){
        console.log("updateMetadata meta: ", meta);
        return await this.prisma.metadata.update({
            where: {
                id: meta.id
            },
            data: {
                value: meta.value
            }
        })
    }

    async addMetadata(name, value, type,sampleId){
        const meta = {
            name,
            value,
            type,
            sampleId
        }
        console.log("addMetadata meta: ", meta); 

        return await this.prisma.metadata.create({data:meta})
    }

   
//       async update({projectId, sampleId, sample}) {
//         console.log("put sample: ", {projectId, sampleId, sample});

//         const oldsampledata = await this.prisma.sample.findFirst({
//             where:{
//                 id:sampleId,
//                 //projectId:projectId
//             },
//             include:{
//                 metadata:true,
//                 metadataModel:false,
//                 subsample:false
//             }})
//             .then((payload) => {
//                 console.debug("Find old value:",payload)
//                 const metadataArray = this.metadata2Array(sample);

//                 const meta = payload.metadata;
//                 // var metaMerged = [];
//                 metadataArray.forEach(m => {
//                     if (payload[m.name] == undefined) {
//                         this.addMetadata(m.name, value, m.type, sampleId);
//                     }

//                     if ( meta[m.name] != payload[m.name]){
//                         // metaMerged[m.name]=meta[m.name]
//                         var newMeta/*:Metadata*/ = { ...meta[m.name] }
//                         newMeta.value = payload[m.name].value
//                         this.updateMetadata(newMeta);
//                     }

//                 });
//             })
//             .catch((e) => {
//                 console.log("Cannot get the previous state. Error: ", e);
//                 throw "Cannot update, Cannot get the previous state";
//             });
        

//         const metadataArray = this.metadata2Array(sample);

//         // const sampleUpdated =
// console.log("metadataArray: ", metadataArray);

//         return await this.prisma.sample.update({
//             where: {
//                 id: sampleId,
//                 projectId: projectId
//             },
//             data: {
//                 metadata: {
//                     create: [
//                         ...metadataArray
//                     ]
//                 }
//             }
        
//         });
        
//         // if (sample.name) {data['name'] = sample.name;}
//         // if (sample.metadataModelId) {data['metadataModelId'] = sample.metadataModelId;}

//         // console.log("Update: ", sampleUpdated);

//         // return await this.prisma.sample.update({
//         //     where: {
//         //         id: sampleId
//         //     },
//         //     data: sampleUpdated
//         // });
//     }
   

stringify = (value,type) => {
    if (type == "string") {
        return value;
    }
    if (type == "number") {
        return value.toString();
    }
    if (type == "boolean") {
        return value == "true";
    }
    if (type == "date") {
        return value.toISOString()
    }
    if (type == "object") {
        return JSON.stringify(value);
    }   
    return value;
}

    async updateSampleMetadata(sampleId, metadataUpdates) {

        var sample = metadataUpdates;

        console.log("updateSampleMetadata sampleId: ", sampleId);
        console.log("updateSampleMetadata metadataUpdates: ", metadataUpdates);

        const existingMetadata = await this.prisma.metadata.findMany({
            where: { sampleId: sampleId }
        });

        const updatePromises = existingMetadata.map(async (metadata) => {
            console.log("updateSampleMetadata existingMetadata.map: ", metadata);

            // const newValue = sample[metadata.name];
            const newValue = this.stringify(sample[metadata.name], metadata.type);

            console.debug('type : ', typeof newValue);

            // enleve du tableau
            console.debug("remove metadata.name from the array")
            sample[metadata.name] = undefined;

            console.log("updateSampleMetadata newValue: ", newValue);
            if (newValue !== undefined && newValue !== metadata.value) {
                console.log("updating metadata: ", metadata);
                return this.prisma.metadata.update({
                    where: { id: metadata.id },
                    data: { value: newValue }
                });

            }
            // }
            return null;
        });

        console.debug("waiting updatePromises: ", updatePromises);
        await Promise.all(updatePromises.filter(Boolean));
        console.debug("waiting updatePromises: OK");

        const addPromises = Object.entries(sample).map(async ([name, value]) => {
            if (value !== undefined) {
                console.log("adding metadata: ", { name, value });
                return this.prisma.metadata.create({
                    data: {
                        name,
                        value: JSON.stringify(value),
                        type: typeof value,
                        sampleId: sampleId
                    }
                });
            }
            return null;
        });
        console.debug("waiting addPromises: ", addPromises);
        await Promise.all(addPromises.filter(Boolean));
        console.debug("waiting addPromises: OK");

        // return the updated sample
        return await this.prisma.sample.findUnique({
            where: { id: sampleId },
            include: { metadata: true }
        });
    }


    async update({projectId, sampleId, sample}) {
        console.log("put sample: ", {projectId, sampleId, sample});
        
    return this.updateSampleMetadata(sampleId,sample)
    }



    async deleteSample(sampleId) {

        // console.log("deleteSample: ", {projectId, sampleId});
        console.debug("deleteSample: ", sampleId);

        // need to delete scan before

        const deleteSubSample = this.prisma.metadata.deleteMany({
            where:{
                sampleId
            }
        })

        const deleteSample = this.prisma.sample.delete({
            where:{
                id:sampleId,
                //projectId:projectId
            }
        })

        return await prisma.$transaction(
            [
                deleteSubSample,
                deleteSample
            ],
            // {
            //   isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
            // }
        )

        // return this.prisma.sample.delete({
        //     where:{
        //         id:sampleId,
        //         //projectId:projectId
        //     }
        // });
    }

}
