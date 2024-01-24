
import fs from 'node:fs';
import path from 'node:path';

class file {

    constructor(){}

    mkdir(folderName: fs.PathLike){
        try {
            if (!fs.existsSync(folderName)) {
              fs.mkdirSync(folderName);
            }
          } catch (err) {
            console.error(err);
          }
    }

}