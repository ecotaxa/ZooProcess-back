
const { Drives } = require("../services/prisma/drives")

// const { file } = require("file")
const fs = require('fs');
const path = require('path')

module.exports.Drives = class {

    constructor() {
        this.drives = new Drives()
      }

      async findAll() {
        return this.drives.findAll()
    }

    async get(driveId) {
        return this.drives.get(driveId)
    }

    async add(data) {

        console.log("Drives::add ", data)
        console.log("data.name: ", data.name)
        console.log("DRIVE_PATH: ", process.env.DRIVES_PATH)

        const folderName = path.join(process.env.DRIVES_PATH, data.name)
        console.log("folderName: ", folderName)

        if (!fs.existsSync(folderName)) 
            fs.mkdirSync(folderName,'0777', true)
            // .then(result => {
            //      console.log("result mkdir: ", result)
        return this.drives.add(data)
            // })
            // .catch( err => {
            //     console.error("error: ", err)
            //     throw(err)
            // })

    }

}