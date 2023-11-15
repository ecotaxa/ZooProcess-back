const { Projects } = require("../services/projects");
const { Pets } = require('../services');


const projects = new Projects();
const pets = new Pets();

module.exports = {
    list: async (req,res) => {
        res.json( await projects.findAll(req.query));
        //res.json(pets.findAll2(req.query));
    }
 }