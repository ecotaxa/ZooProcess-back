

// const { Scan } = require ("./prisma/scans")
// const { BackgroundType } = require("./type/background")

// const fs = require('fs');
// const path = require('path')




// module.export.Scan = class {

//     constructor() {
//         this.scan = new Scan()
//       }

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
        

// }