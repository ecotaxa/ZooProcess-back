const { isRoleAllowed } = require("../routes/validate_tags");

module.exports = {

    list: async (req,res) => {
        // if ( !isRoleAllowed(req)){
        //     return res.status(401).send("You are not authorized to access this resource")
        // }
        
        console.log("vignette list", req);

        const mockData = {
            scan: 'apero2023_pp_wp2_001_st01_d_d1_1_567.jpg',
            matrix: 'masque_compresse.gz',
            mask: undefined,
            vignettes: undefined,
        };
        const folder = "/test/1"

        const mockList = Array(2).fill(mockData);

        console.log("list", mockList);

        return res.status(200).json({data:mockList, folder})
    }

}
