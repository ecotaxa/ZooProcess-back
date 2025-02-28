const { Instrument } = require("../services/instrument");
const { isRoleAllowed } = require("./validate_tags");


const instruments = new Instrument();

module.exports = {

    list: async (req, res) => {

        console.log("Instrument list")

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("authorized")

        console.debug("req.params", req.params );
        console.debug("req.query", req.query );
        console.log("req.params.instrumentId", req.params.instrumentId );

        return instruments.findAll(req.query)
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

        return instruments.add(req.body)
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

    update: async (req,res) => {
        console.log("Instrument update", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }


        instruments.get(req.params.instrumentId)
        .then(async (instrument) => {
            if (instrument == null){
                return res.status(404).json({error:"Instrument not found"})
            }
            return instrument
        })
        .then(async (instrument) => {
            instrumentUpdated = {...instrument, ...req.body}
            return instrumentUpdated
        })
        .then(async (instrument) => {
            // return instruments.update(req.body)
            return instruments.update(instrument)
        })
        .then(result => {
            console.log("OK", res)
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })
    },


    get: async (req,res) => {

        console.log("Instrument get", req.params.instrumentId)
        
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        let archived = req.query.archived //|| false; // forced to false by default, but let undefined to get all instruments

        return instruments.get(req.params.instrumentId, archived)
        .then(instrument => {
            return res.status(200).json(instrument)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 

    }
}