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

    status: async (req,res) => {
        // console.log("status");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return tasks.get({taskId:req.params.taskId})
        .then(result => {
            // console.log("OK", result) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })
    },

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

    run: async (req,res) => {
        console.log("run",req.body);
        
        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        const authHeader = req.headers.authorization;
        console.debug("*********************************************");
        console.debug("authHeader", authHeader);
        console.debug("*********************************************");

        return tasks.run(req.body,authHeader)
        .then(result => {
            console.log("OK", result) 
            return res.status(200).json(result)
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
