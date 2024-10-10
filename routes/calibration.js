const { Calibration } =  require('../services/calibration');
const { isRoleAllowed } = require("./validate_tags");


const calibration = new Calibration();

module.exports = {

    create: async (req,res) => {
        console.log("calibration post", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.log("authorized")

        console.log("req.params", req.params );
        console.log("req.params.instrumentId", req.params.instrumentId );

        return calibration.add(req.body)
        .then(result => {
            console.log("OK", res)
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Calibration with frame '"+ req.body.frame +"' already exist";
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

        console.log("Calibration get", req.params.calibrationId);
        
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return calibration.get(req.params.calibrationId)
        .then(instrument => {
            return res.status(200).json(instrument)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 

    },

    update: async (req, res) => {
        // res.json(await projects.update(req.body, req.params.projectId))

        console.log("Calibration::update");
        console.log("id: ", req.params.calibrationId);
        console.log("body: ", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return calibration.update({data:req.body, calibrationId:req.params.calibrationId})
        .then(project => {
            return res.status(200).json(project)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 

    }

}
