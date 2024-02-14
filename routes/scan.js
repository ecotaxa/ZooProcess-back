// const { Scan, BackgroundType } = require("../services/scan")
// const { isRoleAllowed } = require("../routes/validate_tags");

// const scan = new Scan();

// module.exports = {

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

// }
