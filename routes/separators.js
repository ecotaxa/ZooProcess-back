const { Separators } = require("../services/separators");
const { isRoleAllowed } = require("../routes/validate_tags");

const separators = new Separators();

module.exports = {

    list: async (req,res) => {

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return separators.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    status: async (req,res) => {
        console.log("create");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return separators.get({taskId:req.params.taskId})
        .then(result => {
            console.log("OK", result) 

            // let res = { ...result.json }
            // res.body.type = result.json.type;

            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })
    },

    create: async (req,res) => {
        console.log("create");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return separators.add()
        .then(result => {
            console.log("OK", result) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })
    },

    update: async (req,res) => {
        
        console.log("Separators::update");
        console.log("id: ", req.params.taskId);
        console.log("body: ", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return separators.update({body:req.body, taskId:req.params.taskId})
        .then(result => {
            console.log("OK", result) 
            // return res.status(200).json(result)
            let vignette = result;
            vignette.type = vignette.type.toLowerCase();

            return res.status(200).json(vignette)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })
    }

}

// Prisma list error
// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
