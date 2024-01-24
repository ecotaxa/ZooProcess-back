const { Users } = require("../services/users");
const { Prisma } = require("@prisma/client");

const users = new Users();

module.exports = {
    list: async (req, res) => {

        console.log("Route User::get", req);
        console.log("Route User::get params", req.params);


        return users.findAll(req.query)
        .then(users => {
            return res.status(200).json(users);
        })
        .catch(async(e) => {
            console.error("Error:",e );
            return res.status(500).json({error:e});
        })
    },

    create: async (req, res) => {
        console.log("Route User create", req.body);

        return users.add(req.body)
        .then(user => {
            console.log("OK", user) 
            return res.status(200).json(user)
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

    get: async (req, res) => {

        console.log("Route User::get", req.params);

        return users.get(req.params.userId)
        .then(user => {
            return res.status(200).json(user)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 

    },

    update: async (req, res) => {
        // res.json(await projects.update(req.body, req.params.projectId))

        console.log("Route User::update");
        console.log("id: ", req.params.id);
        console.log("body: ", req.body);

        return users.update({body:req.body, userId:req.params.id})
        .then(user => {

            console.log("user updated: ", user)

            return res.status(200).json(user)
        })
        .catch(async(e) =>{
            console.error("Error:",e );
            return res.status(500).json({error:e});
        }) 

    }

 }
