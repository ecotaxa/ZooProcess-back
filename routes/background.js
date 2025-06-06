// const { Scan, BackgroundType } = require("../services/scan")

// const { BackgroundType } = require("../services/type/background");
// const { Background } = require("../services/background");

const container = require('../services/container');

const { isRoleAllowed } = require("../routes/validate_tags");
const { Tasks } = require("../services/Tasks/tasks");

const tasks = new Tasks();

// const scan = new Scan();
// const background = new Background();
// const background = new Background();
// const background = container.get('background');

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
        const background = container.get('background');

        return background.findAll(req.params.instrumentId,false)
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
        const background = container.get('background');

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
        console.log("background::listFromProject()")

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        // console.log("authorized")

        console.debug("req.params", req.params );
        console.debug("req.params.projectId", req.params.projectId );


        const background = container.get('background');

        return background.findAllfromProject(req.params.projectId)
        .then(scans => {
            return res.status(200).json(scans);
        })
        .catch(async(e) => {
            // console.error("Error toto:", e );
            console.error("Error message:",e.message );
            console.error("Error name:",e.name );
            if (e.name == 'NotFoundException') {
            // // if (e.message == 'Project not found') {
            //     console.debug("qaaaaaaaaaaaaaaa")
            //     const j = {
            //         message: 'Project not found',
            //         errors:[{
            //             path: 'projectId',
            //             message: e.message
            //         }]
            //     }
            //     console.debug("j",j)
            //     // return res.status(404).json(j);
                return res.status(404).json({error:"Project not found"});
            }
            
            // console.debug("sdfskdjbfsdkjhfksdjhfksdjfhk")
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


        const background = container.get('background');

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
        // console.log("------------------------------------------");
        // console.log("create",req);
        // console.log("create files",req.files);
        // console.log("------------------------------------------");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.log("req.jwt: ", req.jwt)
        const userID = req.jwt.id

        console.log("req.body: ", req.body);
        console.log("req.body.url: ", req.body.url);
        console.log("req.body.type: ", req.body.type);
        console.log("req.params: ", req.params);
        console.log("req.query", req.query );
        console.log("req.query.nomove", req.query.nomove );
        console.log("req.query.task", req.query.task );

        let move = true
        // if ( req.query.nomove ) move = false
        if ( req.query.nomove == true || req.query.nomove === null ) {
            move = false
        }
        let subsampleId = String(req.params.subSampleId)

        // let task = false
        // if ( req.query.nomove ) move = false
        if ( req.query.task == true || req.query.task === null ) {
            // task = true
            // const task = new Tasks()
            console.debug("---> use taskId")
            // subsampleId = tasks.get(subsampleId)
            // .then(response=>{
            //     console.debug("subsampleId:",response.subsampleId)
            //     return response.subsampleId
            // })
            // .catch(async(e) => {
            //     console.error("Error:",e );
            //     return res.status(500).json({error:e});
            // })

            // let task = await this.prisma.task.findUnique({
            //     where:{
            //         id: subsampleId
            //     }
            // })
            let task = await tasks.get({taskId:subsampleId})
            console.log("task:", task)
            if ( task.params.subsample == undefined ) {
                return res.status(422).json({error:"subsampleId not found in task params."});
            }
            subsampleId = task.params.subsample     
        }  



        const background = container.get('background');

        return background.addurl3({
            // userId:id,
            userId:userID,
            url: req.body.url,
            subsampleId, // :req.params.subSampleId,
            type:req.body.type,
            move,
        })
        .then(result => {
            console.log("added scan OK", res) 
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

    // create: async (req,res) => {
    //     console.log("------------------------------------------");
    //     console.log("create",req);
    //     // console.log("create files",req.files);
    //     console.log("------------------------------------------");

    //     if ( !isRoleAllowed(req)){
    //         return res.status(401).send("You are not authorized to access this resource")
    //     }

    //     console.log("req.jwt: ", req.jwt)
    //     const userID = req.jwt.id

    //     return background.add({
    //         userId:id,
    //         image:req.body, 
    //         instrumentId:req.params.instrumentId 
    //         /*, type:BackgroundType.BACKGROUND*/
    //     })
    //     .then(result => {
    //         // console.log("OK", res) 
    //         return res.status(200).json(result)
    //     })
    //     .catch(async(e) => {
    //         console.error("Error:",e )

    //         if (e.name == "PrismaClientKnownRequestError"){
    //             if (e.code == "P2002"){
    //                 const txt = "Drive with name '"+ req.body.name +"' already exist";
    //                 const message = { error:txt };
    //                 return res.status(500).json({error:message});
    //             }
    //             else {
    //                 return res.status(500).json({error:e})
    //             }
    //         }
    //         return res.status(500).json({error:e})
    //     })
    // },


    addurl: async (req,res) => {
        console.log("------------------------------------------");
        console.log("route/background/addurl()");
        // console.log("route/background/addurl",req);
        // console.log("create files",req.files);
        console.log("addurl Req.query", req.query);
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

        let params = {
            userId:id,
            //image:req.body, 
            url: req.body.url,
            instrumentId:req.params.instrumentId,
            projectId: req.query.projectId
            /*, type:BackgroundType.BACKGROUND*/
        }


        if ( req.body.taskId ){
            params = {
                ...params,
                taskId: req.body.taskId
            }
        } else {
            params = {
                ...params,
                taskId: "RAW_BACKGROUND"
            }
        }

        if ( req.body.type ){//&& req.body.type == "MEDIUM_BACKGROUND"){
            params = {
                ...params,
                type: req.body.type
            } 
        } else {
            params = {
                ...params,
                type: "MEDIUM_BACKGROUND"
            }
        }

        if ( req.body.subsampleId ){
            params = {
                ...params,
                subsampleId: req.body.subsampleId
            }
        }
        
        console.debug("params: ", params);

    try {
        // return await background.addurl({
        //     userId:id,
        //     //image:req.body, 
        //     url: req.body.url,
        //     instrumentId:req.params.instrumentId,
        //     projectId: req.query.projectId
        //     /*, type:BackgroundType.BACKGROUND*/
        // })
        const background = container.get('background');
        return await background.addurl(params)
        .then(result => {
            console.debug("background.addurl -> OK", result) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Route background addurl Error:", e )

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
            console.debug("not PrismaClientKnownRequestError:",e)
            return res.status(500).json({error:e})
        })
    }
    catch(err){
        console.error("500 Error:",e )
        return res.status(500).json({error:e})
    }
    },

    importurl: async (req,res) => {
        console.log("------------------------------------------")
        console.log("route/background/importurl");
        console.log("------------------------------------------");
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.debug("req.body:", req.body)

        const userID = req.body.userId || req.jwt.id
        console.debug("userID", userID)
        if ( req.body.subsampleId && req.body.subsampleId != req.params.subSampleId ){
            return res.status(500).json({error:"the subsampleId defined in body is different from the subsampleId defined in the url"})
        }
        if ( req.body.subsampleId         ){
            const background = container.get('background');
            return background.importurl({
                userId:userID,
                //image:req.body, 
                url: req.body.url,
                subsampleId:req.params.subSampleId,
                // subsampleId:req.body.subSampleId,
                // instrumentId:req.params.instrumentId // got from the project
                /*, type:BackgroundType.BACKGROUND*/
            })
            .then(result => {
                // console.log("OK", res) 
                return res.status(200).json(result)
            })
            .catch(async(e) => {
                console.error("Error (background.importurl):",e )

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
        } else {
            // some background are not linked to any scan
            // then we can't have the subsampleId            
            if ( ! req.body.instrumentId){
                return res.status(500).json({error:"The instrumentId is required"})
            }

            // return res.status(500).json({error:"subsampleId is required"})
            const background = container.get('background');
            return background.importurl2({
                instrumentId:req.body.instrumentId,
                userId : req.jwt.id, // we don't know the user too
                //image:req.body,
                url: req.body.url,
                // subsampleId:req.params.subSampleId,
                projectId: req.body.projectId, // but you know the project as we import it
                // instrumentId:req.params.instrumentId // got from the project
                /*, type:BackgroundType.BACKGROUND*/
                type:req.body.type
            })
            .then(result => {
                // console.log("OK", res)
                return res.status(200).json(result)
            })
            .catch(async(e) => {
                console.debug("i am here")
                console.error("Error (background.importurl2):",e )
            })
        }
    },

    addurl2: async (req,res) => {
        console.debug("------------------------------------------");
        console.debug("route/background/addurl2");
        // console.debug("create",req);
        // console.debug("create files",req.files);
        console.debug("------------------------------------------");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        // console.log("req.jwt: ", req.jwt)
        const userID = req.jwt.id

        // plus besoin géré dans openapi
        // if ( req.body.url == undefined){
        //     return res.status(400).json({error:"URL is required"})
        // }

        // if ( req.body.subSampleId == undefined) {
        //     return res.status(400).json({error:"subsampleId is required"})
        // }
        console.debug("req.body: ", req.body);
        console.debug("req.body.url: ", req.body.url);
        console.debug("req.params: ", req.params);

        if ( req.body.subsampleId && req.body.subsampleId != req.params.subSampleId ){
            return res.status(500).json({error:"the subsampleId defined in body is different from the subsampleId defined in the url"})
        }
        if ( req.body.subSampleId && req.body.subSampleId != req.params.subSampleId ){
            return res.status(500).json({error:"the subSampleId defined in body is different from the subsampleId defined in the url"})
        }

        let params = {
            userId:id,
            //image:req.body, 
            url: req.body.url,
            subsampleId:req.params.subSampleId,
            // subsampleId:req.body.subSampleId,
            // instrumentId:req.params.instrumentId // got from the project
            /*, type:BackgroundType.BACKGROUND*/
        }
        if (req.body.type){
            params.type = req.body.type
        }

        const background = container.get('background');
        return background.addurl2(params)
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





    linkScanToSubsample: async (req,res) => {
        console.debug("------------------------------------------");
        console.debug("route/background/linkScanToSubsample");
        console.debug("------------------------------------------");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        console.log("req.body:",req.body)

    try {
        const { scanId, subSampleId } = req.body;
        const params = {scanId, subSampleId}
        console.debug("params:",params)
        const background = container.get('background');
        const result = await background.linkScanToSubsample(params);
          
          if (result.notFound) {
            return res.status(422).json({
              message: result.message,
              data: result.data
            });
          }

          if (result.conflict) {
            return res.status(409).json({
              message: result.message,
              data: result.data
            });
          }
          
          return res.status(200).json(result);
        } catch (error) {
          console.error("Error (background.linkScanToSubsample):", error);
          return res.status(500).json({ error });
        }
    
    
    
    },


}
