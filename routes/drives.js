const Service = require("../services/Service");
const { Drives } = require("../services/drives")

const drives = new Drives();

module.exports = {

    list: async (req,res) => {
        // res.json( await drives.findAll(req.query));

        return drives.findAll(req.query)
        .then(payload => {
            // console.log("rrrr", res) 
            return res.status(200).json(payload)
            // return res.json(Service.successResponse(drives))
        })
        .catch(async(e) => {
            console.error("-------")
            console.error("Error:",e )
            console.error("-------")
            
            //throw(e)
            // return Service.rejectResponse(e)
            // return { error:e, code:500 };
            // return res.json({ code:403, error:e});
            return res.status(403).error(e)// .message(e)
        })



        // try {
        //     console.log('get_projects()')
      
        //     const payload = drives.findAll();
        //     console.log('payload= ', payload);

        //     return res.json(payload)
      
        //     // resolve(Service.successResponse(payload));
        //   } catch (e) {
        //     // reject(Service.rejectResponse(
        //     //   e.message || 'Invalid input',
        //     //   e.status || 405,
        //     // ));

        //     // const ret = {
        //     //     status:500,
        //     //     message:e
        //     // }

        //     res.status = 500;
        //     res.message = e
        //     return res


        //   }



    },

    create: async (req,res) => {
        console.log("create",req.body);

        //res.json( await drives.create(req.body));

        return drives.add(req.body)
        .then(result => {
            console.log("rrrr", res) 
            // return res
            return res.status(200).json(result)
            // return Service.successResponse(res,result)

        })
        .catch(async(e) => {
            console.error("-------")
            console.error("Error:",e )
            console.error("-------")
            
            //throw(e)

            let message = e;
            if (e.name == "PrismaClientKnownRequestError"){
                if (e.code == "P2002"){
                    const txt = "Drive with name '"+ req.body.name +"' already exist";
                    message = { error:txt }
                    return res.status(500).json({error:message});
                }
                else {
                    return res.status(500).json({error:e})
                }
            }

            return res.status(500).json({error:e}) //.error(e)// .message(e)

            // return res.json(Service.rejectResponse(e))
            // return { error:e, code:500 };
            // return res.json({ code:403, error:e});
        })


    }

}

// Prisma list error
// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes