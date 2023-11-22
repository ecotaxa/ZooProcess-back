const { Projects } = require("../services/projects");


const projects = new Projects();

module.exports = {
    list: async (req,res) => {
        // console.log("Projects::create",req);
        // res.json( await projects.findAll(req.query));

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
        // res.json( await projects.create(req.body));

        //TODO: make foder here
        // if (ok) => add to DB

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
        // res.json(await projects.get(req.params))

        console.log("Projects::get", +req.params.id);

        return this.get(+req.params.id)
          .then(res => {
              console.log("rrrr",res) 
              // this.prisma.$disconnect()
              return res
           })
          .catch(async(e) =>{
              // this.prisma.$disconnect()
              console.error(e)
              throw(e)
          }) 

    },

    update: async (req, res) => {
        res.json(await projects.put(req))
    }

 }