
module.exports = {
    isRoleAllowed : (req) => {
        const allowedRoles = req.openapi.schema.tags;
        const role = req.jwt.role
        console.log("role: ", role)
        console.log("TAGS", allowedRoles);
    
        allowed = allowedRoles.includes(role) ? true : false

        // if ( !allowed && role == "Manager"){
        //     allowed = true
        // }

        // if ( !allowed && role == "Admin"){
        //     allowed = true
        // }

        // return allowedRoles.includes(role) ? true : false
        return allowed
    }

}
