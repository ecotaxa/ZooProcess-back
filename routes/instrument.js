const { Instrument } = require("../services/instrument");
const { isRoleAllowed } = require("./validate_tags");


const instrument = new Instrument();

module.exports = {

    list: async (req, res) => {

        console.log("Instrument list")

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("authorized")

        console.log("req.params", req.params );
        console.log("req.params.instrumentId", req.params.instrumentId );

        return instrument.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    create : async (req,res) => {

        console.log("Instrument create", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return instrument.add(req.body)
        .then(result => {
            console.log("OK", res)
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Instrument with name '"+ req.body.name +"' already exist";
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

    get: async (req,res) => {

        console.log("Instrument get", req.params)   
    }
}