const { Projects } = require("../services/projects");


const projects = new Projects();

module.exports = {
    list: async (req,res) => {

        return projects.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).error(e);
        })
    },

    create: async (req,res) => {
        console.log("create", req.body);

        return projects.add(req.body)
        .then(result => {
            console.log("OK", res) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:",e )

            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Project with name '"+ req.body.name +"' already exist";
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

        console.log("Projects::get", req.params.projectId);

        return projects.get(req.params.projectId)
        .then(project => {
            return res.status(200).json(project)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).error(e);
        }) 

    },

    update: async (req, res) => {
        res.json(await projects.put(req))
    }

 }
