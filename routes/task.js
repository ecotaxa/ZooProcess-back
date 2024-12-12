// const { Tasks } = require("../services/Tasks/tasks");
const { Tasks } = require("../services/tasks");
console.log("import Tasks:", Tasks);

const { isRoleAllowed } = require("../routes/validate_tags");
// const { Process } = require("../services/process");

const tasks = new Tasks();
// const process = new Process();

// module.exports = {
const handlers = {

    list: async (req,res) => {

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return tasks.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    // status: async (req,res) => {
    //     console.debug("status()");
    //     if ( !isRoleAllowed(req)){
    //         return res.status(401).send("You are not authorized to access this resource")
    //     }

    //     console.debug("get taskId: ", req.params.taskId);
    //     console.error("taskId is required req.params:", req.params);

    //     if( req.params.taskId == undefined){
    //         console.error("taskId is required req.params:", req.params);
    //         return res.status(400).json({error:"taskId is required"})
    //     }

    //     return tasks.get({taskId:req.params.taskId})
    //     .then(result => {
    //         // console.log("OK", result) 
    //         return res.status(200).json(result)
    //     })
    //     .catch(async(e) => {
    //         console.error("status Error:",e )
    //         return res.status(500).json({error:e})
    //     })
    // },


    create: async (req,res) => {
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("Task::create() body: ", req.body);

        return tasks.add(req.body)
        .then(result => {
            console.log("OK", result) 
            console.log("Task::create() -> result: ", result["id"]);
            return res.status(200).json({id:result["id"]})
        })
        .catch(async(e) => {
            console.error("Task::create() Error:",e )
            return res.status(500).json({error:e})
        })
    },

    // status: async (req,res) => {
    //     console.debug("status()");
    //     if ( !isRoleAllowed(req)){
    //         return res.status(401).send("You are not authorized to access this resource")
    //     }
    
    //     console.debug("get taskId: ", req.params.taskId);
    //     console.error("taskId is required req.params:", req.params);
    
    //     if( req.params.taskId == undefined){
    //         console.error("taskId is required req.params:", req.params);
    //         return res.status(400).json({error:"taskId is required"})
    //     }
    
    //     return tasks.get({taskId:req.params.taskId})
    //     .then(result => {
    //         // console.log("OK", result) 
    //         return res.status(200).json(result)
    //     })
    //     // .catch(async(e) => {
    //     //     console.error("status Error:",e )
    //     //     return res.status(500).json({error:e})
    //     // })
    //     // .catch(async(e) => {
    //     //     console.error("status Error:",e )
    //     //     return res.status(500).json({
    //     //         error: e.message || String(e)
    //     //     })
    //     // })
    //     .catch(async(e) => {
    //         console.error("status Error:", e);
    //         const errorResponse = {
    //             error: e.message || String(e)
    //         };
    //         const errorResponse2 = {
    //             status: 500,
    //             error: "Static error message for testing frontend",
    //             details: "Task status could not be retrieved"
    //         };
    //         console.log("Sending error response:", errorResponse);
    //         return res.status(500).json(errorResponse2);
    //         // return res.status(500).json({
    //         //     error: e.message || String(e)
    //         // });
    //     })
    
    // }
    

    status: async (req,res) => {
        console.debug("route Task status() - Headers:", req.headers);
        
        // ... existing role check ...
    
        return tasks.get({taskId:req.params.taskId})
        .then(result => {
            console.debug("status() - OK");
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("status Error:", e);
            const errorResponse2 = {
                status: 500,
                error: "Static error message for testing frontend",
                details: "Task status could not be retrieved"
            };
            console.log("Full response being sent:", {
                status: 500,
                headers: res.getHeaders(),
                body: errorResponse2
            });
            
            // Set explicit headers
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json(errorResponse2);
        })
    }
    
    
    ,

    // run: async (req,res) => {
    //     console.log("run",req.body);
        
    //     if ( !isRoleAllowed(req)){
    //         return res.status(401).send("You are not authorized to access this resource")
    //     }

    //     const authHeader = req.headers.authorization;
    //     console.debug("*********************************************");
    //     console.debug("authHeader", authHeader);
    //     console.debug("*********************************************");

    //     return tasks.run(req.body,authHeader)
    //     .then(result => {
    //         console.log("OK", result) 
    //         return res.status(200).json(result)
    //     })
    //     .catch(async(e) => {
    //         console.debug("Error to run task:",e )
    //         console.error("Error:",e )
    //         return res.status(500).json({error:e})
    //     })

    // },

    // run: async (req, res) => {
    //     console.log("run", req.body);
    
    //     if (!isRoleAllowed(req)) {
    //         return res.status(401).json({
    //             error: "Unauthorized access"
    //         });
    //     }
    
    //     const authHeader = req.headers.authorization;
    
    //     try {
    //         const result = await tasks.run(req.body, authHeader);
    //         console.log("OK", result);
    //         return res.status(200).json(result);
    //     } catch (error) {
    //         console.error("Error running task:", error);
    //         return res.status(500).json({
    //             error: error.message || "Failed to run task",
    //             details: error
    //         });
    //     }
    // },
    


    run: async (req, res) => {
        console.log("route Task.run()", req.body);
    
        if (!isRoleAllowed(req)) {
            return res.status(401).json({
                error: "You are not authorized to access this resource"
            });
        }
    
        const authHeader = req.headers.authorization;
    
        // try {
        //     const result = await tasks.run(req.body, authHeader);
        //     return res.status(200).json(result);
        // } catch (error) {
        //     // Extract the specific error message about missing background
        //     const errorMessage = error.message || "Task processing failed";
        //     console.error("Error running task:", error);
        //     return res.status(500).json({
        //         error: errorMessage,
        //         taskId: req.body.taskId
        //     });
        // }

        // try {
        //     const result = await tasks.run(req.body, authHeader);
        //     return Response.json(result);
        // } catch (error) {
        //     return Response.json({
        //         error: {
        //             message: error.message || "Task processing failed",
        //             code: "TASK_PROCESS_ERROR",
        //             taskId: req.body.taskId
        //         }
        //     }, { status: 500 });
        // }

        // try {
        //     const result = await tasks.run(req.body, authHeader);
        //     return res.status(200).json(result);
        // } catch (error) {
        //     console.error("Task::run() Error:", error);
        //     return res.status(500).json({error: error.message || error});
        // }
   
        tasks.run({taskId: req.params.taskId}, req.headers.authorization)
            .then(result => {

                console.log("route Task run() OK", result)

                return res.status(200).json(result);
            })
            .catch(error => {
                console.error('route Task run error:', error);
                return res.status(500).json({error: error.toString()});
            });

    },

    delete: async (req,res) => {
        console.log("deleteTask body:",req.body);
        console.log("deleteTask params.projectId:",req.params.projectId);
        console.debug("deleteTask params:",req.params);
        console.debug("deleteTask query:",req.query);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        projectId = req.query.projectId
        if ( projectId == "all") {
            if ( !isRoleAllowed(req)){
                return res.status(401).send("You are not authorized to access this resource")
            }
        }

        return tasks.delete({projectId})
        .then(result => {
            console.log("OK", result)
            return res.status(200).json("done")
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })
    },

    deleteAllTaskOfProcess: async (req,res) => {
        console.log("deleteAllTaskOfProcess",req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return tasks.deleteAllByType({type:"PROCESS"})
        .then(result => {
            console.log("OK", result)
            return res.status(200).json("done")
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })

    },

    exist: async (req,res) => {
        console.exist("exist", req.body);
        
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return tasks.exist(req.body)
        .then(result => {
            console.log("OK", result) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })

    },

    update:  async (req,res) => {
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }
        console.log("Task::update() body: ", req.body);

        return tasks.setTaskStatus(req.params.taskId,req.body)
        // return tasks.update({taskId:req.params.taskId,data:req.body})
        .then(result => {
            console.log("OK", result) 
            console.log("Task::update() -> result: ", result["id"]);
            return res.status(200).json({id:result["id"]})
        })
        .catch(async(e) => {
            console.error("Task::update() Error:",e )
            return res.status(500).json({error:e})
        })
        // return res.status(200).json({id:req.params.taskId})
    },

}

module.exports = handlers;
