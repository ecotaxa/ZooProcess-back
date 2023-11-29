const { Prisma } = require("@prisma/client");
const { Samples } = require("../services/samples");

const samples = new Samples();


module.exports = {

    list: async (req,res) => {
        console.log("list req.query:", req.query);
        console.log("list req.params:", req.params);

        return samples.findAll(req.params.projectId)
        .then(payload => {
            console.log("samples list: ", payload)
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        });
    },
    
    get: async (req,res) => {
        return samples.get({projectId:req.params.projectId, sampleId:req.params.sampleId})
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        });
    },

    create: async (req,res) => {
        // console.log("create",req.body);
        console.log("create",{projectId:req.params.project, sample:req.body});

        return samples.add({projectId:req.params.project, sample:req.body})
        .then(result => {
            // console.log("OK", res) 
            console.log("OK", result);
            return res.status(200).json(result);
        })
        .catch(async(e) => {
            console.error("Error:",e );

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Sample with name '"+ req.body.name +"' already exist";
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

        console.log("delete: ",{projectId:req.params.projectId, sampleId:req.params.sampleId});

        return samples.deleteSample({projectId:req.params.projectId, sampleId:req.params.sampleId})
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(error) => {
            // console.error("Error:",error );
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                //   console.log("ERROR: ",error);
                  console.log("ERROR: ",error.meta.cause);
                //   return res.status(500).send(error.meta.cause);
                //   return res.status(500).json({message:error.meta.cause});
                //   return res.status(500).send({error:error.meta.cause});
                  return res.status(200).send("OK");
                }
                console.log(error.message);
                return res.status(500).json({error:error});
            }
        });
    }

}