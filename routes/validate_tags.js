
module.exports = {
    isRoleAllowed : (req, forcedRole) => {
        const allowedRoles = req.openapi.schema.tags;
        if ( req.jwt && req.jwt.role){
            const role = req.jwt.role
            // console.log("role: ", role)
            // console.log("TAGS", allowedRoles);
        
            allowed = allowedRoles.includes(role) ? true : false
    
            if ( !allowed && role == "Manager"){
                allowed = true
            }
    
            if ( !allowed && role == "Admin"){
                allowed = true
            }
    
            // return allowedRoles.includes(role) ? true : false
            return allowed    
        } else {
            if (allowedRoles.includes("Authentication")){
                return true
            } else {
                return false
            }    
        }
    }

}
