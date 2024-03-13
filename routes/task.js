const { Tasks } = require("../services/tasks");
const { isRoleAllowed } = require("../routes/validate_tags");

const tasks = new Tasks();

module.exports = {

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
        console.log("create");

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return tasks.get({taskId:req.params.taskId})
        .then(result => {
            console.log("OK", result) 
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

        return await tasks.run(req.body)
        .then(result => {
            console.log("OK", result) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )
            return res.status(500).json({error:e})
        })

    }

}
