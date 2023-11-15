const { Projects } = require("../services/projects");


const projects = new Projects();

module.exports = {
    list: (req,res) => {
        res.json(projects.findAll(req.query));
    }
 }