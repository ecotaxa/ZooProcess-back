const { Qc } = require("../services/qc");
const { isRoleAllowed } = require("../routes/validate_tags");



const qc = new Qc()

module.exports = {

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