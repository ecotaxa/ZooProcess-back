const { MetadataModel } = require("../services/metadataModel");


const metadataModel = new MetadataModel();


module.exports = {

    list: async (req,res) => {

        return metadataModel.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).error(e);
        })
    },

    get: async(req,res)=>{

        console.log("MetadaType::get", req.params.id);

        return metadataModel.get(req.params.id)
        .then(model => {
            return res.status(200).json(model)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).error(e);
        }) 
    },

    create: async (req,res) => {
        console.log("create", req.body);

        return metadataModel.add(req.body)
        .then(result => {
            console.log("OK", res) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Project with name '"+ req.body.name +"' already exist";
                    const message = { error:txt };
                    return res.status(500).json({error:message});
                }
                else {
                    return res.status(500).json({error:e})
                }
            }
            return res.status(500).json({error:e})
        })
    }

}

