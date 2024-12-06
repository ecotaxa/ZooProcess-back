const { Qc } = require("../services/qc");
const { isRoleAllowed } = require("../routes/validate_tags");
const { get } = require("./subsamples");



const qc = new Qc()

module.exports = {

    list: async (req,res) => {
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        return qc.findAll()
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e);
            return res.status(500).json({error:e});
        })
    },
    
    get: async (req,res) => {
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        return qc.find({qcId:req.params.qcId})
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })
    },

    create: async (req,res) => {



        console.log("qc create()");


        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        const data = req.body ?? {}

        return  qc.create(data)
        .then(qc => {
            return res.status(200).json(qc)
        })
        .catch(async (error) => {
            console.error("QC Create Error:", error);
            return res.status(500).json({error});
        })



    }

}