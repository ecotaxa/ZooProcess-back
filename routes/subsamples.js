const { Prisma } = require("@prisma/client");
const { SubSamples } = require("../services/subsamples");
const { MetadataModel } = require("../services/metadataModel");
const { isRoleAllowed } = require("../routes/validate_tags");

const subsamples = new SubSamples();


module.exports = {

    list: async (req,res) => {
        console.log("list req.query:", req.query);
        console.log("list req.params:", req.params);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return subsamples.findAll({projectId:req.params.projectId, sampleId:req.params.sampleId})
        .then(payload => {
            console.log("subsamples list: ", payload)
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        });
    },
    
    get: async (req,res) => {

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.debug("subsample get", req.params);
        return subsamples.get({projectId:req.params.projectId, sampleId:req.params.sampleId, subSampleId: req.params.subSampleId})
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        });
    },

    create: async (req,res) => {

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.log("create", req.body);
        console.log("Subsample create", {projectId:req.params.projectId, sampleId:req.params.sampleId, subsample:req.body});

        return subsamples.add({projectId:req.params.projectId, sampleId:req.params.sampleId, subsample:req.body})
        .then(result => {
            // console.log("OK", res) 
            console.log("OK", result);
            return res.status(200).json(result);
        })
        .catch(async(e) => {
            console.error("Error:",e );

            if (e.name == Prisma.PrismaClientKnownRequestError.name){
                if (e.code == "P2002"){
                    const txt = "SubSample with name '"+ req.body.name +"' already exist";
                    const message = { error:txt };
                    return res.status(500).json({error:message});
                }
                else {
                    return res.status(500).json({error:e});
                }
            }
            return res.status(500).json({error:e});
        });
    },

    delete: async (req,res) => {

        // console.log("list req.query:", req.query);
        // console.log("list req.params:", req.params);
        // console.log("res: ",res);
        // console.log("res.status: ",res.status);

        console.log("delete: ", {projectId:req.params.projectId, sampleId:req.params.sampleId, subSampleId:req.params.subSampleId});

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

// start transaction

        const subsample = subsamples.get({projectId:req.params.projectId, sampleId:req.params.sampleId, subSampleId:req.params.subSampleId})

        const metadataModel = new MetadataModel();
        metadataModel.deleteMetadata({metadataId: subsample.metadataId})


        return subsamples.deleteSubSample({projectId:req.params.projectId, sampleId:req.params.sampleId, subSampleId:req.params.subSampleId})
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(error) => {
            // console.error("Error:",error );
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                  console.log("ERROR: ",error.meta.cause);
                  return res.status(204).send("OK");
                }
                console.log(error.message);
                return res.status(500).json({error:error});
            }
        })
        .finally( () => {
            // end transaction
        })
        ;
    },


    //http://localhost:3001/api/subsample/6718b8446a417cb382c781e0/6718eb7b6a417cb382c78395/673f48f71e5039acf464dd5e

    process: async (req,res) => {

        console.log("route::subsamples::process(req.params):",req.params)

        // return subsamples.process()
        // return get.process()

        // console.log("req.params",req.params)

        return subsamples.get({projectId:req.params.projectId, sampleId:req.params.sampleId, subSampleId: req.params.subSampleId})
        .then(subsample => {
            // console.log("OK", res) 
            console.log("route::subsamples::process OK", subsample);

            const scan = subsample.scan
            const vis = scan.find(s=>s.type=  "VIS" )
            const mask = scan.find(s=>s.type=  "MASK" )
            const out = scan.find(s=>s.type=  "OUT" )
            const gif = scan.find(s=>s.type=  "GIF" )

            const data = {
                vis:vis.url,
                mask:nak.url,
                out:out.url,
                gif:gif.url
            }

            console.log("process() return data:",data);

            return res.status(200).json(data);

            // return res.status(200).json(subsample);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        });

    }

}
