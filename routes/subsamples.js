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

        // console.log("create",req.body);
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

    process: async (req,res) => {

        console.log("route::subsamples::process(req):",req)

        return subsamples.process()
        .then(result => {
            // console.log("OK", res) 
            console.log("OK", result);
            return res.status(200).json(result);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        });

    }

}
