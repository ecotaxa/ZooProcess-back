const { MetadataModel } = require("../services/metadataModel");
const { Prisma } = require("@prisma/client");
const { isRoleAllowed } = require("../routes/validate_tags");


const metadataModel = new MetadataModel();


module.exports = {

    list: async (req,res) => {

        console.log("create Body", req.body);
        console.log("create Req", req.query);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return metadataModel.findAll(req.query.sample)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    get: async(req,res)=>{

        console.log("MetadaType::get", req.params.id);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return metadataModel.get(req.params.id)
        .then(model => {
            return res.status(200).json(model)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 
    },

    create: async (req,res) => {
        console.log("create", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return metadataModel.add(req.body)
        .then(result => {
            console.log("OK", res) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Metadata with name '"+ req.body.name +"' already exist";
                    const message = { error:txt };
                    return res.status(500).json({error:message});
                }
                else {
                    return res.status(500).json({error:e})
                }
            }
            return res.status(500).json({error:e})
        })
    },

    delete: async (req, res) => {
        console.log("delete ", req.params.id);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return metadataModel.deleteMetadataModel(req.params.id)
        .then(result => {
            console.log("OK", res);
            console.log("blabla",result)
            return res.status(200).send("OK"); //.json(result)
        })
        .catch(async(error) => {
            console.log(error);

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                  console.log("ERROR: ",error.meta.cause);
                  return res.status(204).send("OK");
                }
            }

            if (error == "Not Empty"){
                const txt = "Metadata '"+ req.body.name +"'cannot be delete, sample and/or subsample are associated to it";
                const message = { error:txt };
                return res.status(409).json({error:error})
            }
            return res.status(500).json({error:error})
        })
    }

}

