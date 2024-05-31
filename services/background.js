

const { Scans } = require ("./prisma/scans")
// const { BackgroundType } = require("./type/background")

const fs = require('fs');
const path = require('path');
const { Projects } = require("./prisma/projects");
// const background = require("../routes/background");


module.exports.Background = class {

  constructor() {
    // const background = true

    this.folderName = path.join( process.env.DRIVES_PATH , "Background")

    if (!fs.existsSync(this.folderName)) 
      fs.mkdirSync(this.folderName,'0777', true)

    this.scans = new Scans()
  }

    // // createFolder(url/*?:string = undefined*/ , type/*:?BackgroundType*/ = BackgroundType.SCAN) {
    // // createFolder(url/*?:string = undefined*/ ) {
    // createFolder({image, instrumentId }){
    //     const folderDestination = ""

    //     // if (type == BackgroundType.BACKGROUND) {
    //         folderDestination = "Background"
    //     // } else {
    //     //     if (url == undefined) {
    //     //         throw new Error("sample is undefined, cannot create folder")
    //     //     }
    //     //     folderDestination = url
    //     // }

    //     folderName = path.join(process.env.DRIVES_PATH, folderDestination)
    //     console.log("folderName: ", folderName)
    //     if (!fs.existsSync(folderName)) 
    //         fs.mkdirSync(folderName,'0777', true)
    // }


    async findAll(instrumentId/*:string*/) {
        console.log("Background Service findAll", instrumentId)
        // throw new error("out")
        // return []

        const params = {
          background: true,
          instrumentId
        }

        return this.scans.findAll(params)
        // return Promise()
    }

    // async add({ project, sample, subSample, image, type}) {
    // async add({ instrumentId, image}) {

    //     console.log("Scan::add")
    //     console.log("image: ", image)
    //     // console.log("data.filename: ", data.filename)
    //     // console.log("project: ", project)
    //     // console.log("sample: ", sample)
    //     // console.log("subSample: ", subSample)
    //     console.log("instrumentId: ", instrumentId)
    //     // console.log("data.backgroundType: ", type)
    // }

    async findAllfromProject(projectId/*:string*/) {
      console.log("Background Service findAllfromProject", projectId)
      // throw new error("out")
      // return []

      // const projectInst = new Projects()
      // return projectInst.get(projectId)
      // .then(project => {
      //   if ( project == null ) {
      //     console.log("project is null")
      //     throw new Error("Project not found")
      //   }
      //   console.log("project: " , project)
      //   const instrumentId = project.instrumentId;
      //   console.log("instrumentId", instrumentId);
      //   if (instrumentId == null){
      //     //return new 
      //     //return res.status(404).json({error:"Project has no instrument assigned"});
      //     // return res.status(404).json({error:"Project has no instrument assigned"});
      //     throw {error:"Project has no instrument assigned"}
      //   }
    
      //   const params = {
      //     background: true,
      //     instrumentId
      //   }
  
      //   return this.scans.findAll(params)  
      // })

      // console.log("p", p);
      // return p


      // return Promise()

      return this.scans.findAllFromProject({background: true, projectId})

  }


    ///TODO: function NOT WORKING (image is missing, name is a fake)
    async add({ instrumentId , image , userId /*, type*/}) {

        console.log("background::add")
        console.log("image: ", image)
        console.log("instrumentId: ", instrumentId)
        console.log("userId: ", userId)

        // save image in folder : Background/{instrumentId}
        const filename = "___TODO___fake___2024_02_07_08_52_10_0001.jpg"


        // const url = ""
        // if ( background){

        // }
        const url = path.join( this.folderName , filename)
        // write image

        // add in DB
        const data = {
            instrumentId,
            //filename,
            //image,
            userId : userId,
            url,
            background: true,
        }

        return this.scans.add(data)

    }
        
    async addurl({ instrumentId , url , userId /*, type*/}) {

      console.log("background::add")
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
          userId : userId,
          url,
          background: true,
      }

      return this.scans.add(data)
  }
      

  async addurl2({ instrumentId , url , userId , subsampleId/*, type*/}) {

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

