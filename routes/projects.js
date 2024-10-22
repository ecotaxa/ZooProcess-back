const { Projects } = require("../services/projects");
const { Prisma } = require("@prisma/client");
const { isRoleAllowed } = require("../routes/validate_tags");

const projects = new Projects();

module.exports = {
    list: async (req,res) => {

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return projects.findAll(req.query)
        .then(payload => {
            return res.status(200).json(payload);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    create: async (req,res) => {
        console.log("create", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return projects.add(req.body)
        .then(result => {
            console.log("OK", result) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:", e )

            if (e.name == Prisma.PrismaClientKnownRequestError.name ){ //"PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Project with name '"+ req.body.name +"' already exist";
                    const message = { message:txt };
                    console.log("Error 409: ",{error:message})
                    return res.status(409).send(txt) //.json({error:message});
                }
                else {
                    return res.status(500).json({error:e})
                }
            } else {
                return res.status(500).json({error:e})
            }
        })
    },

    get: async (req,res) => {

        console.log("Projects::get", req.params.projectId);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return projects.get(req.params.projectId)
        .then(project => {
            return res.status(200).json(project)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 

    },

    update: async (req, res) => {
        // res.json(await projects.update(req.body, req.params.projectId))

        console.log("Projects::update");
        console.log("id: ", req.params.projectId);
        console.log("body: ", req.body);

        if ( !isRoleAllowed(req)){
            return res.status(401).send("You are not authorized to access this resource")
        }

        return projects.update({body:req.body, projectId:req.params.projectId})
        .then(project => {
            return res.status(200).json(project)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 

    },

    delete: async (req,res) => {
        console.log("Projects::delete");
        console.log("id: ", req.params.projectId);

        return projects.deleteid(req.params.projectId)
        .then(project => {
            return res.status(200).json({message:"Project " + string(req.params.projectId) + " deleted"})
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status
         })
    },

 }

