
// import { Project } from "../services/projects";

const path = require('node:path'); 
const url = require('node:url');

interface Drive {
    name : string,
    url: string,
}

interface Project {
    name: string,
    drive : Drive,
}

var globals = {
    path:"/home/sebastiengalvagno/Works/PIQV/plankton"
}


module.exports.Project = class {

    project: Project;

    constructor(project:Project) {
        this.project = project

        let url = new URL(project.drive.url)
        let local = ""
        if ( url.protocol == 'file' || url.protocol == '' ){
            local = path.join(url.pathname,project.name)
            console.log("local path", local)
        } else {
            local = project.name
        }

        let projectPath = path.join(globals.path,local)

        console.log("projectPath: ", projectPath );
    }
    
    createFolder(projectPath: any /*path*/ ): void {

        var fs = require('fs');
        var dir = path.join(globals.path, path);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

    }

}
