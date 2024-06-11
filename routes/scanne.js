

// const { Scan, BackgroundType } = require("../services/scan")

// const ScanService = require("../services/ScanService");
const { Background } = require("../services/background");

const { isRoleAllowed } = require("./validate_tags");

// const scan = new ScanService();
const scan = new Background();

module.exports = {

//     list: async (req,res) => {

//         if ( !isRoleAllowed(req)){
//             return res.status(401).send("You are not authorized to access this resource")
//         }

//         return scan.findAll(req.query, BackgroundType)
//         .then(scans => {
//             return res.status(200).json(scans);
//         })
//         .catch(async(e) => {
//             console.error("Error:",e );
//             return res.status(500).json({error:e});
//         })
//     },

//     create: async (req,res) => {
//         console.log("create",req.body);

//         if ( !isRoleAllowed(req)){
//             return res.status(401).send("You are not authorized to access this resource")
//         }

//         return scan.add({
//             project: req.params.project, 
//             sample: req.params.subSampleId, 
//             subSample: req.params.subSampleId, 
//             image: req.body,
//             type: BackgroundType.SCAN})
//         .then(result => {
//             console.log("OK", res) 
//             return res.status(200).json(result)
//         })
//         .catch(async(e) => {
//             console.error("Error:",e )

//             if (e.name == "PrismaClientKnownRequestError"){
//                 if (e.code == "P2002"){
//                     const txt = "Drive with name '"+ req.body.name +"' already exist";
//                     const message = { error:txt };
//                     return res.status(500).json({error:message});
//                 }
//                 else {
//                     return res.status(500).json({error:e})
//                 }
//             }
//             return res.status(500).json({error:e})
//         })
//     }



list: async (req,res) => {

    console.log("scan list")


    if ( !isRoleAllowed(req)){
        return res.status(401).send("You are not authorized to access this resource")
    }
    console.log("authorized")

    console.log("req.params", req.params );
    console.log("req.params.instrumentId", req.params.instrumentId );

    // return scan.findAll(req.query, BackgrsoundType)
    return scan.findAll(req.params.instrumentId)
    .then(scans => {
        return res.status(200).json(scans);
    })
    .catch(async(e) => {
        console.error("Error:",e );
        return res.status(500).json({error:e});
    })
},

listFromProject: async (req,res) => {
    console.log("scan list fromProject")

    if ( !isRoleAllowed(req)){
        return res.status(401).send("You are not authorized to access this resource")
    }
    console.log("authorized")

    console.log("req.params", req.params );
    console.log("req.params.projectId", req.params.projectId );



    return scan.findAllScanSamplefromProject(req.params.projectId)
    .then(scans => {
        return res.status(200).json(scans);
    })
    .catch(async(e) => {
        console.error("Error:",e );
        return res.status(500).json({error:e});
    })
},




addurl: async (req,res) => {
    console.log("------------------------------------------");
    // console.log("create",req);
    // console.log("create files",req.files);
    console.log("------------------------------------------");

    if ( !isRoleAllowed(req)){
        return res.status(401).send("You are not authorized to access this resource")
    }

    console.log("req.jwt: ", req.jwt);
    const userID = req.jwt.id

    if ( req.body.url == undefined){
        return res.status(400).json({error:"URL is required"})
    }
    console.log("req.body: ", req.body);
    console.log("req.body.url: ", req.body.url);

    return scan.addurl({
        userId:id, // TODO get this value from the bearers
        //image:req.body, 
        url: req.body.url,
        instrumentId:req.params.instrumentId,
        // subsampleId: req.params.subsampleid,
        subsampleId: req.body.subsampleid,
        /*, type:BackgroundType.BACKGROUND*/
    })
    .then(result => {
        // console.log("OK", res) 
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
