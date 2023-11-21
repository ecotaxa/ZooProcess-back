const { Drives } = require("../services/drives")

const drives = new Drives();

module.exports = {

    list: async (req,res) => {
        return drives.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(403).error(e);
        })
    },

    create: async (req,res) => {
        console.log("create",req.body);

        return drives.add(req.body)
        .then(result => {
            console.log("rrrr", res) 
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

// Prisma list error
// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes