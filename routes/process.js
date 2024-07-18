const { Process } = require("../services/process");
const { isRoleAllowed } = require("./validate_tags");


const process = new Process()

module.exports = {

    subsample: async (req,res) => {
        console.log("process.subsample", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return process.subsample(req.body)
        .then(result => {
            console.log("OK", result)
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:", e )
            return res.status(500).json({error:e})
        })
    }

}
