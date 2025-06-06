const { Drives } = require("../services/drives")
const { isRoleAllowed } = require("../routes/validate_tags");

const drives = new Drives();

module.exports = {

    list: async (req,res) => {

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return drives.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    create: async (req,res) => {
        console.log("create",req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return drives.add(req.body)
        .then(result => {
            console.log("OK", res) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Drive with name '"+ req.body.name +"' already exist";
                    const message = { message:txt };
                    console.error("Error 409: ",{error:message})
                    // return res.status(409).json({error:message});
                    return res.status(409).send(txt) //.json({error:message});
                }
                else {
                    return res.status(500).json({error:e})
                }
            }
            return res.status(500).json({error:e})
        })
    }

}

// Prisma list error
// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
