const { Login } = require("../services/login")
const jwt  = require("jsonwebtoken")

const login = new Login();

module.exports = {

    login: async (req,res) => {

        console.log("Route login:", JSON.stringify(req.body))

        const { email, password } = req.body

        return login.login({email})
        .then(payload => {

            console.log("paylod: ", payload)

            if ( payload.password == password ){

                //TODO build token here
                //store it in Session
                // const token = payload.id

                const token = jwt.sign({
                      id : payload.id,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '3d'}
                );

                console.log(`User ${email} logged with token: ${token}`)
                return res.status(200).json(token);
            }
            else {
                return res.status(422).send("Invalid credential")
            }
        })
        .catch(async(e) => {
            console.error("Error:", e);
            return res.status(500).json({error:e});
        })
    },

    logout: async (req,res) => {
        console.log("logout",req.body);

        return login.logout(req.body)
        .then(result => {
            console.log("OK", res) 
            return res.status(200).json(result)
        })
        .catch(async(e) => {
            console.error("Error:", e);
            return res.status(500).json({error:e});
        })
    }

}

// Prisma list error
// https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes