const { Login } = require("../services/login")
const jwt  = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const login = new Login();

module.exports = {
    
    login: async (req,res) => {
        const { email, password } = req.body

        return login.login({email})
        .then(async payload => {
            // Compare hashed password
            const passwordMatch = await bcrypt.compare(password, payload.password)
            
            if (passwordMatch) {
                const token = jwt.sign({
                    id: payload.id,
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
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