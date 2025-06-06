

const { Scans } = require ("./prisma/scans")
// const { BackgroundType } = require("./type/background")
// const { Prisma } = require('./prisma/client');

const fs = require('node:fs');
const path = require('node:path');
const { Projects } = require("./projects");
const { SubSamples } = require("./prisma/subSample");
const { type } = require("node:os");
// const { rejects } = require("assert");

// const { Projects } = require("./prisma/projects");
// const background = require("../routes/background");
// const { Prisma } = require('./client')

const { moveFile } = require('../tools/moveFile');

const { isScanType } = require('./prisma/type');
// const { NotFound } = require("express-openapi-validator/dist/openapi.validator");

const { ensureDirectoryExists } = require ('../tools/fileSystem');
const DriveAccessException = require("../exceptions/DriveAccessException");


module.exports.Background = class {

  // moved to .env
  // zooProcessApiUrl = "http://zooprocess.imev-mer.fr:8081/v1/"
  // happyPipelineUrl = 'http://zooprocess.imev-mer.fr:8000/'


  constructor() {
    // const background = true
    // this.prisma = new Prisma().client;

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

        let params = {
          background: true,
          // instrumentId
        }
        if ( instrumentId){
          params.instrumentId = instrumentId
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

    async findAllScanSamplefromProject(projectId/*:string*/) {
      return this.scans.findAllFromProject({background: false, projectId})
    }

    isShowableImage(path/*:string*/) {
      // var re = /(?:\.([^.]+))?$/;
      var re = /(?:[^\/]\.([^\.\/]+))?$/;
      var ext = re.exec(path)[1];
      console.debug("isShowableImage: ", path, ext) 
      if (ext == "jpg" || ext == "jpeg" || ext == "png") return true
      console.debug("isShowableImage: false" )
      return false
    }

    async converttiff2jpg(pathl/*:string*/,pathd/*:string*/) {
      const server = "http://zooprocess.imev-mer.fr:8000"
      const url = server + "/convert/"
      console.debug("converttiff2jpg path: ", path)
      let body = {
        src: pathl,
      }
      if ( pathd ){
        body.dst = pathd
      }
      
      const bodytext = JSON.stringify(body)
      console.debug("converttiff2jpg body: ", body)
      // const response = 
      return await fetch( url , {
          method: "POST",
          body: bodytext, // JSON.stringify(data),
          // body: data_test,
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "User-Agent": "Zooprocess v10",
              // "Access-Control-Allow-Origin":"no-cors"
          },
      })
      .then((response) => {
          if (response.ok) {
              console.log("converttiff2jpg fetch response: ", response)
              console.log("converttiff2jpg fetch response.text: ", response.text)
              return response

              // response.text()
              // .then((imageUrl) => {
              //     // setImageUrl(imageUrl);
              //     console.log("imageUrl: ", imageUrl)
              //     const localPath = pathToSessionStorage(imageUrl)
              //     console.log("localPath: ", localPath)
              //     setBackground(localPath)
              //     return response
              // })
              // .catch((error) => {
              //     console.log("Cannot convert Tiff to Jpg error: ", error)
              //     const errormsg = { message:"Cannot convert Tiff to Jpg error: " + error}
              //     // setMsg(errormsg.message)
              //     // setError(errormsg)
              //     throw new Error(errormsg)
              // })
          } else {
              console.error("Resp NOK", response.status)
              // setError(response)
              // setError([response])
              if ( response.status == 422) {
                  console.error("The server do not accept your connection")
                  console.error("Can't connect: ", response)
                  // setMsg("The server do not accept your connection")
                  throw new Error("The server do not accept your connection")
                  // throw new Error({message:"The server do not accept your connection"})
              } else {
                  console.error("Cannot convert Tiff to Jpg error: ", response)
                  // setMsg("Cannot convert Tiff to Jpg error:")
                  throw new Error("Cannot convert Tiff to Jpg error: " + response)
                  // throw new Error({message:"Cannot convert Tiff to Jpg error: " + response})
              }
          }
      })   
    }

    async findScan(scanId, show=false){
      console.log("Background Service scan",scanId)
      // return await this.scans.findScan(scanId) // missing {} around scanId
      // return this.scans.findScan({scanId})

      return this.scans.findScan({scanId})
      .then(async (scan) => {
        if (show == false){
          return scan
        }

        // need to convert if neccessary
        if (this.isShowableImage(scan.url)){
          return scan
        }

        let pathdest = undefined
        pathdest = scan.url.replace(".tif", ".jpg")

        pathdest = pathdest.replace("/upload/", "/show/")
        if ( pathdest.indexOf("/drives/") != -1 ){
          console.debug("pathdest: ", pathdest)
          console.debug("working in drives")
          pathdest = pathdest.replace("/Zooscan_back/", "/show/Zooscan_back/")
          pathdest = pathdest.replace("/Zooscan_work/", "/show/Zooscan_work/")
        }
        console.debug("pathdest after replace: ", pathdest)

        // convert to jpg
        console.log("converttiff2jpg scan.url: ", scan.url)
        return await (await this.converttiff2jpg(scan.url, pathdest)).text()
        .then(async (imageUrl) => {

          console.log("imageUrl: ", imageUrl)

          // clean text
          imageUrl = imageUrl.replace(/"/g, "")

          let newscan = {...scan , url: imageUrl}
          return newscan
        })
      })
      // .catch(async(e/*:Error*/) => {          
      // })


    }



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


  async linkScanToSubsample({ scanId, subSampleId }) {
    console.log("Background Service: linking scan to subsample");
    console.log("scanId:", scanId);
    console.log("subSampleId:", subSampleId);
    
    // Use the scans service that's already initialized in the constructor
    return this.scans.linkToSubsample({ scanId, subSampleId });
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
        

 

    // used by POST /background/{instrumentId}/url?projectId={projectId}
    async addurl({ instrumentId , url , userId , projectId , type}) {

      try {
      console.log("background::addurl()")
      console.log("url: ", url)
      console.log("instrumentId: ", instrumentId)
      console.log("userId: ", userId)
      console.log("projectId: ", projectId)
      console.log("type: ", type)


      if (! isScanType(type)){
        return Promise.reject(`Invalid type ${type}`)
      }
      console.log("type OK: ", type)

      if ( projectId == undefined){
        console.error("projectId is undefined")
        return Promise.reject("projectId is required")
      }
      console.debug("projectId defined: ", projectId)


      // save image in folder : Background/{instrumentId}
      // const filename = "2024_02_07_08_52_10_0001.jpg"


      // const url = ""
      // if ( background){

      // }
      // const url = path.join( this.folderName , filename)
      // write image

      // l'url est locale, il faut le changer en url du project



      const projects = new Projects()
      const project = await projects.get(projectId)
      console.log("project: ", project)

      let drive = project.drive.url
      console.log("drive: ", drive)
      if ( drive.substring(0, "file://".length) == "file://"){
        drive = drive.substring("file://".length)
      }
      console.log("drive: ", drive)



      const root = process.env.ROOT_PATH //|| ""
      if ( root == undefined){
        // throw ("ROOT_PATH is undefined")
        throw new MissingDataException("ROOT_PATH is undefined");
      }

      console.debug("root: ", root)

      const date /*: string*/ = new Date().toISOString().split("T")[0]
      const filename = date + "_" + path.basename(url)
      console.debug("date: ", date) 
      console.log("filename: ", filename)

      const projectPath = path.join( root , drive, project.name , "Zooscan_back")
      console.log("projectPath:", projectPath)

      ensureDirectoryExists(projectPath, project.drive);

      const newurl = path.join(projectPath, filename).toString()
      console.log("url: ", newurl)

      // move file from url to urlnew
      // make path
      console.debug("move file from url to urlnew")
      if (!fs.existsSync(projectPath)){
        fs.mkdirSync(projectPath, { recursive: true });
      }
      // move file

      // if ( !fs.existsSync(url)){
      //   console.error("file "+url+" not found")
      //   return Promise.reject("file "+url+" not found")
      // }
      // //try{
      // fs.rename(url, newurl, async (err) => {
      //   if (err) {
      //     console.error(err)
      //     // throw err;
      //     // throw Error(err);
      //     // throw new Error("error moving file")
      //     // reject()
      //     // return Promise.reject( "error moving file" + JSON.stringify(err))
      //     // return new Promise.reject( "error moving file")
      //     // const error =  Error("error moving file")
      //     // return Promise.reject( error )
      //     return Promise.reject(err)
      //   }
      //   console.log("The file has been saved at",newurl," !");
      // });
      // }
      // catch(err){
      //   console.error(err)
      //   // throw err;
      //   // throw Error(err);
      //   // throw new Error("error moving file")
      //   // reject()
      //   // return Promise.reject( "error moving file" + JSON.stringify(err))
      //   // return new Promise.reject( "error moving file")
      //   // const error =  Error("error moving file")
      //   // return Promise.reject( error )
      //   return Promise.reject(err)
      // }
      
      try {
        await moveFile(url, newurl);
        // Continue with the rest of your code after successful move
      } catch (err) {
        console.error("Error moving file:", err);
        if ( err.code === 'ENOSPC'){
          console.error("No left space on device")
          return Promise.reject({error:err, message:"No left space on device"})
        }
        return Promise.reject(err);
      }
      console.log("The file has been moved to ", newurl," !");


      // add in DB
      const data = {
          instrumentId,
          //filename,
          //image,
          projectId: projectId,
          userId : userId,
          url: newurl,
          background: true,
          type: type
      }

      console.debug("data: ", data)

      return this.scans.add(data)

    } catch (error) {
      if (error instanceof DriveAccessException) {
        console.error("Directory error:", error.message);
        console.error("error:", error)
        // You can handle the error specifically here
        const err = {
          message:error.message,
          url:error.url,
          stack:error.stack
        }
        console.debug("err:",err)
        // throw error;
        throw err;
      }
      // Handle other errors
      throw error;
    }

  }

  async importurl2({ instrumentId,  url , projectId, userId, type}) {
    console.debug("service::background:importurl2")
    console.debug("url: ", url)
    console.debug("instrumentId: ", instrumentId)
    console.debug("userId: ", userId)
    console.debug("projectId: ", projectId)

    const data = {
      instrumentId,
      //filename,
      //image,
      userId,
      // src: url,
      url,
      background: true,
      type: type,
      projectId,
      // subsampleId: Null,
      createdAt: "9999-03-07T08:26:38.988Z"
  }
  console.log("data: ", data)
  return this.scans.add(data)

    // return Promise.reject("to implement")

  }

  
  async importurl({ /*instrumentId ,*/ url , userId = undefined , subsampleId /*, type*/}) {
    console.log("background:importurl")
    console.log("url: ", url)
    // console.log("instrumentId: ", instrumentId)
    console.log("userId: ", userId)
    console.log("subsampleId: ", subsampleId)

    const subSamples = new SubSamples()
    const subSample = await subSamples.find({subSampleId:subsampleId})
    console.log("subSample", subSample)

    if ( ! subSample ){
      return Promise.reject("Can't find the subsample")
    }
    const project = subSample[0].sample.project
    console.log("project: ", project)
    console.log("project.id: ", project.id)

    // add in DB

    console.log("project.id: ", project.id)

    const data = {
        instrumentId: project.instrumentId,
        userId,
        subsampleId,
        // src: url,
        url: url,
        background: false,
        projectId: project.id
    }

    console.log("data: ", data)
    return this.scans.add(data)
  }

  /**
   * url
   * userId
   * subsampleId
   * type
   */
  async addurl2(params) {
    try {
      const { url , userId , subsampleId, type = undefined} = params
      console.debug("service::background:addurl2")
      console.debug("url: ", url)
      console.debug("userId: ", userId)
      console.debug("subsampleId: ", subsampleId)
      console.debug("type: ", type)

      const subSamples = new SubSamples()
      const subSample = await subSamples.find({subSampleId:subsampleId})
      console.debug("subSample", subSample)

      if ( ! subSample ){
        return Promise.reject("Can't find the subsample")
      }

      const project = subSample[0].sample.project
      console.debug("project: ", project)

      let drive = project.drive.url
      console.debug("drive: ", drive)
      if ( drive.substring(0, "file://".length) == "file://"){
        drive = drive.substring("file://".length)
      }
      console.debug("drive: ", drive)


      const root = process.env.ROOT_PATH //|| ""
      if ( root == undefined){
        return Promise.reject({
          NotFound:true,
          message:"addurl2 ROOT_PATH is undefined",
        })
        // throw ("addurl2 ROOT_PATH is undefined") ///TODO change this with the object notFound
        // return Promise.reject("ROOT_PATH is undefined")

      }

      const filename = path.basename(url)
      console.debug("filename: ", filename)
      const projectPath = path.join( root , drive, project.name , "Zooscan_scan" , "_raw" )
      console.debug("projectPath:", projectPath)
      const newurl = path.join(projectPath, filename).toString()
      console.debug("url: ", newurl)

      // test if source file exist
      if ( !fs.existsSync(url)){
        return Promise.reject("File do not exist: " + url) ///TODO change to an object
      }

    // move file from url to urlnew
      console.debug("addurl2 - moving file from url to urlnew")
      try {
        if (!fs.existsSync(projectPath)){ // if folder don't exist
          fs.mkdirSync(projectPath, { recursive: true, mode: 0o777 });
        }
      } catch (dirError) {
        console.error("Error creating directory:", dirError);
        return Promise.reject({
          message: "Permission denied: Cannot create directory for scan storage",
          details: dirError.message,
          code: dirError.code,
          path: dirError.path
        });
      }
      /**
       * Function to rename file 
       * @param {string} oldPath 
       * @param {string} newPath 
       * @returns 
       */
      function renameSubSampleSync(oldPath, newPath) {
        console.debug("addurl2 - renameSubSampleSync")
        console.debug("oldPath: ", oldPath)
        console.debug("newPath: ", newPath)
        if ( oldPath == newPath) {
          console.log('Old and new paths are the same. No need to rename.');
          return true;
        }

        // test if newPath already exist
        if (fs.existsSync(newPath)) {
          console.log('New path already exists. No need to rename.');
          return true;
        }

        try {
          fs.renameSync(oldPath, newPath);
          console.log('SubSample renamed successfully');
          return true;
        } catch (error) {
          console.error('Error renaming subSample:', error);
          // throw error;
          // throw new Error('addurl2 - Cannot save the scan in the project folder: ' +  error);

          try{
            console.debug("addurl2 - copy & delete file")
            fs.copyFileSync(oldPath, newPath);
            fs.unlinkSync(oldPath);
            console.log('File copied and original deleted successfully');
          }
          catch (copyError) {
            console.error('Error copying file:', copyError);
            throw new Error('addurl2 - Cannot save the scan in the project folder: ' +  copyError);
          } 
        }
      }
    
    try {
      renameSubSampleSync(url,newurl)
    } catch (moveError) {
      return Promise.reject({
        message: "Cannot save the scan in the project folder",
        details: moveError.message,
        code: moveError.code,
        path: moveError.path
      });
    }
    

    // add in DB

    console.log("project.id: ", project.id)

    let data = {
        instrumentId: project.instrumentId,
        //filename,
        //image,
        userId,
        subsampleId,
        // src: url, // pq c'est  pas newurl ??
        //url,
        url: newurl,
        background: false,

        projectId: project.id
    }
    if ( type ){
      data.type = type
    }

    console.log("data: ", data)

    return this.scans.add(data)
  } catch (error) {
    console.error("Error in addurl2:", error);
    return Promise.reject({
      message: "Error processing scan file",
      details: error.message,
      code: error.code,
      path: error.path
    });
  }

}
  



async addurl3({ url , userId , subsampleId, type, move}) {

  console.log("background:addurl3")
  console.log("url: ", url)
  console.log("userId: ", userId)
  console.log("subsampleId: ", subsampleId)
  console.log("type: ", type)

  const subSamples = new SubSamples()
  const subSample = await subSamples.find({subSampleId:subsampleId})
  console.log("subSample", subSample)

  if ( ! subSample ){
    return Promise.reject("Can't find the subsample (bad id)")
  }

  const project = subSample.sample.project
  console.log("project: ", project)

  let drive = project.drive.url
  console.log("drive: ", drive)
  if ( drive.substring(0, "file://".length) == "file://"){
    drive = drive.substring("file://".length)
  }
  console.log("drive: ", drive)


  // const root = process.env.ROOT_PATH || "/app/public"
  const root = process.env.ROOT_PATH //|| ""
      if ( root == undefined){
        return Promise.reject({
          NotFound:true,
          message:"addurl2 ROOT_PATH is undefined",
        })
  }

  let newurl = url
  if ( move){
    const filename = path.basename(url)
    console.log("filename: ", filename)
    const projectPath = path.join( root , drive, project.name , "Zooscan_scan" , "_raw" )
    console.log("projectPath:", projectPath)
    const newurl = path.join(projectPath, filename).toString()
    console.log("url: ", newurl)

    // move file from url to urlnew
    // make path
    console.debug("addurl3 -- moving file from url to urlnew 2")
    if (!fs.existsSync(projectPath)){
      fs.mkdirSync(projectPath, { recursive: true });
    }

    // move file
    if ( !fs.existsSync(url)){
      return Promise.reject("File do not exist: " + url)
    }


    function renameSubSampleSync(oldPath, newPath) {
      if ( oldPath == newPath) {
        console.log('Old and new paths are the same. No need to rename.');
        return true;
      }
      
      try {
        fs.renameSync(oldPath, newPath);
        console.log('SubSample renamed successfully');
        return true;
      } catch (error) {
        console.error('Error renaming subSample:', error);
        // throw error;
        throw new Error('addurl3 - Cannot save the scan in the project folder: ' +  error);
      }
    }
    
    renameSubSampleSync(url,newurl)
  }

  // add in DB

  console.log("project.id: ", project.id)

  const data = {
      instrumentId: project.instrumentId,
      userId,
      subsampleId,
      // src: url,
      url: newurl,
      type,

      projectId: project.id
  }

  console.log("data: ", data)

  return this.scans.add(data)
}


async medium(data, bearer, taskInstance){
  console.log("tasks::medium()")
  console.debug("background tasks::process data:", data)
  console.debug("tasks::process bearer:", bearer)

  const taskId = data.id
  console.debug("process - taskId:",taskId)
  taskInstance.setTaskStatus(taskId, {status:"ANALYSING",log:"analysing"})

  taskInstance.setTaskStatus(taskId, {status:"RUNNING",log:"running"})

  const body = {

    taskId: data.id,
    instrumentId: data.params.instrumentId,
    // src: "srcpath",
    // dst: "dstpath",
    // back1: data.params.background[0],
    // back2: data.params.background[1],
    projectId: data.params.project,
    background:data.params.background,

    // scanId: data.params.scanId,
    // taskId: taskId,
    bearer: bearer,
    db: "http://zooprocess.imev-mer.fr:8081/v1/",
}


console.debug("body:", body)


  const processUrl = `${this.happyPipelineUrl}background/`
  console.debug("processUrl:",processUrl)
//   fetch(processUrl, {
//     method: 'POST',
//     body: JSON.stringify(body),
//     headers: { 
//         'Content-type': 'application/json; charset=UTF-8',
//         "Accept": "application/json",
//         "User-Agent": "Zooprocess v10",
//         "Authorization": bearer

//     },
// })
// .then(async (response) => {
//     console.debug("---------> response", response)
//     if (! response.ok) {
//         console.debug("Happy reponse:",response.status)
//         // const text = await response.text();
//         try {
//           const text = response.text();
//           console.error("Error details:", text);
//           return Promise.reject(`Cannot launch the task ${taskId} - Error: ${response.status}`);
//           // throw Error(`Cannot launch the task ${taskId} - Error: ${response.status}`);
//         }
//         catch (error) {
//           // console.error("Error details:", error);
//           // return Promise.reject(`Cannot launch the task ${taskId} - Error: ${error}`);
//           return Promise.reject(error);

//         }
//     }
//   return response.json()
// })
try {
  const response = await fetch(processUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
          "Accept": "application/json",
          "User-Agent": "Zooprocess v10",
          "Authorization": bearer
      },
  });

  if (!response.ok) {
      const text = await response.text();
      console.error("Error details:", text);
      throw new Error(`Cannot launch the task ${taskId} - Error: ${response.status}`);
  }

  return await response.json();
} catch (error) {
  throw error;
}

}

}

