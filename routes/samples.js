const { Samples } = require("../services/samples");

const samples = new Samples();


module.exports = {

    list: async (req,res) => {
        console.log("list req.query:", req.query);
        console.log("list req.params:", req.params);

        return samples.findAll(req.params.projectId)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).error(e);
        })
    },
    
    get: async (req,res) => {
        return samples.get({projectId:req.params.projectId, sampleId:req.params.sampleId})
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).error(e);
        })
    },

    create: async (req,res) => {
        console.log("create",req.body);

        return samples.add({projectId:req.params.projectId, sample:req.body})
        .then(result => {
            console.log("OK", res) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Drive with name '"+ req.body.name +"' already exist";
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