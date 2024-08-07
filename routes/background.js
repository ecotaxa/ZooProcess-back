// const { Scan, BackgroundType } = require("../services/scan")

// const { BackgroundType } = require("../services/type/background");
const { Background } = require("../services/background");


const { isRoleAllowed } = require("../routes/validate_tags");

// const scan = new Scan();
// const background = new Background();
const background = new Background();

module.exports = {

    list: async (req,res) => {

        console.log("background list")


        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("authorized")

        console.log("req.params", req.params );
        console.log("req.params.instrumentId", req.params.instrumentId );

        if ( req.params.instrumentId == undefined) {
            return res.status(400).send("instrumentId is undefined")
        }

        // return scan.findAll(req.query, BackgrsoundType)
        return background.findAll(req.params.instrumentId)
        .then(scans => {
            return res.status(200).json(scans);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    scan: async (req,res) => {
        console.log("background scan")

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("authorized")

        console.log("req.params", req.params );
        console.log("req.params.projectId", req.params.projectId );
        console.log("req.params.scanId", req.params.scanId );
        console.log("req.query.show", req.query.show );

        let show = false
        if ( req.query.show === undefined || req.query.show == false ) {
            show = false
        } else {
            if ( req.query.show == true || req.query.show === null ) {
                show = true
            }    
        }

        console.debug("show", show);

        return background.findScan(req.params.scanId, show)
        .then(scan => {
            return res.status(200).json(scan);
        })
        .catch(async(e/*:Error*/) => {

            console.error("Error: -> ", e);
            if ( e == "No scanId provided" ) {
                return res.status(422).json({error:e});
            }

            return res.status(500).json({error:e});
        })
    },

    listFromProject: async (req,res) => {
        console.log("background list fromProject")

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("authorized")

        console.log("req.params", req.params );
        console.log("req.params.projectId", req.params.projectId );



        return background.findAllfromProject(req.params.projectId)
        .then(scans => {
            return res.status(200).json(scans);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    listFromProject2: async (req,res) => {
        console.log("background list fromProject")

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("authorized")

        console.log("req.params", req.params );
        console.log("req.params.projectId", req.params.projectId );



        return background.findAllfromProject(req.params.projectId)
        .then(scans => {
            return res.status(200).json(scans);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    create: async (req,res) => {
        console.log("------------------------------------------");
        console.log("create",req);
        // console.log("create files",req.files);
        console.log("------------------------------------------");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.log("req.jwt: ", req.jwt)
        const userID = req.jwt.id

        return background.add({
            userId:id,
            image:req.body, 
            instrumentId:req.params.instrumentId 
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
    },


    addurl: async (req,res) => {
        console.log("------------------------------------------");
        console.log("addurl",req);
        // console.log("create files",req.files);
        console.log("addurl Req", req.query);
        console.log("------------------------------------------");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        // console.log("req.jwt: ", req.jwt)
        const userID = req.jwt.id

        if ( req.body.url == undefined){
            console.error("background.addurl: URL is required")
            return res.status(400).json({error:"URL is required"})
        }
        console.log("req.body.url: ", req.body.url);

        if ( req.query.projectId == undefined){
            return res.status(400).json({error:"ProjectId is required"})
        }
        console.log("req.query.projectId: ", req.query.projectId);

    try {
        return await background.addurl({
            userId:id,
            //image:req.body, 
            url: req.body.url,
            instrumentId:req.params.instrumentId,
            projectId: req.query.projectId
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
                    const txt = "Drive with name '" + req.body.name + "' already exist";
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
    catch(err){
        console.error("Error:",e )
        return res.status(500).json({error:e})
    }
    },


    addurl2: async (req,res) => {
        console.log("------------------------------------------");
        // console.log("create",req);
        // console.log("create files",req.files);
        console.log("------------------------------------------");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.log("req.jwt: ", req.jwt)
        const userID = req.jwt.id

        // plus besoin géré dans openapi
        // if ( req.body.url == undefined){
        //     return res.status(400).json({error:"URL is required"})
        // }

        // if ( req.body.subSampleId == undefined) {
        //     return res.status(400).json({error:"subsampleId is required"})
        // }
        console.log("req.body: ", req.body);
        console.log("req.body.url: ", req.body.url);

        return background.addurl2({
            userId:id,
            //image:req.body, 
            url: req.body.url,
            subsampleId:req.params.subSampleId,
            // instrumentId:req.params.instrumentId // got from the project
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
