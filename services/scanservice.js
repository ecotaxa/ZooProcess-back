

const { Scans } = require ("./prisma/scans")
// const { BackgroundType } = require("./type/background")

const fs = require('fs');
const path = require('path')




module.export.ScanService = class {

    constructor() {
        // console.debug("module.export.Scan constructor")
        this.scans = new Scans()
      }

//     createFolder(url/*?:string = undefined*/ , type/*:?BackgroundType*/ = BackgroundType.SCAN) {

//         const folderDestination = ""

//         if (type == BackgroundType.BACKGROUND) {
//             folderDestination = "Background"
//         } else {
//             if (url == undefined) {
//                 throw new Error("sample is undefined, cannot create folder")
//             }
//             folderDestination = url
//         }

//         folderName = path.join(process.env.DRIVES_PATH, folderDestination)
//         console.log("folderName: ", folderName)
//         if (!fs.existsSync(folderName)) 
//             fs.mkdirSync(folderName,'0777', true)
//     }

//     async findAll() {
//         return this.scans.findAll()
//     }

//     async add({ project, sample, subSample, image, type}) {

//         console.log("Scan::add ", data)
//         console.log("data.filename: ", data.filename)
//         console.log("data.backgroundType: ", type)

//     }
 
    async findAll(instrumentId/*:string*/) {
        console.log("Scan Service findAll", instrumentId)
        // throw new error("out")
        // return []

        const params = {
            background: false,
            instrumentId
        }

        return this.scans.findAll(params)
        // return Promise()
    }

    async findAllfromProject(projectId/*:string*/) {
        console.log("Scan Sample Service findAllfromProject", projectId)  

        return this.scans.findAllFromProject({background: false, projectId})
    }

    async addurl({ instrumentId , url , userId , subsampleId/*, type*/}) {

        console.log("scan:add")
        console.log("url: ", url)
        console.log("instrumentId: ", instrumentId)
        console.log("userId: ", userId)

        // save image in folder : Background/{instrumentId}
        // const filename = "2024_02_07_08_52_10_0001.jpg"


        // const url = ""
        // if ( background){

        // }
        // const url = path.join( this.folderName , filename)
        // write image

        // add in DB
        const data = {
            instrumentId,
            //filename,
            //image,
            userId,
            subsampleId,
            url,
            background: false,
        }

        console.log("data: ", data)

        return this.scans.add(data)
    }
    

}


