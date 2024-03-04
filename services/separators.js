
const { Prisma } = require('./client');


// const { file } = require("file")
// const fs = require('fs');
// const path = require('path')

module.exports.Separators = class {

    constructor() {
        this.prisma = new Prisma().client;
    }

    async findAll() {
        return this.prisma.separator.findAll()
    }

    async get({taskId}) {
        return this.prisma.separator.findUnique({
            where:{
                id: taskId
            },
            include:{
            //     scan: true,
            //     task: true,
            //     // project: true,
            //     // user: true
                vignette: true,
            }
        })
    }

    async add() {

        console.log("Separator::add")

        return this.prisma.separator.create({})
    }

    // async update({body, taskId}) {
        
    //     console.log("Separator::update")
    //     console.log("taskId", taskId)
    //     console.log("body", body)

    //     return this.prisma.separator.findUnique({
    //         where:{
    //             id: taskId
    //         }
    //     })
    //     .then(task => {
        
    //         console.log("task", task)

    //         let data = {
    //             // id: task.id,
    //         }
    //         if ( task.scanId){
    //             data.scanId = task.scanId
    //         }

    //         if ( task.vignette){
    //             data.vignette= [
    //                 ...task.vignette,
    //                 body
    //             ]
    //         } else {
    //             data.vignette = [
    //                 body
    //             ]
    //         }


    //         return this.prisma.separator.update({
    //             where:{
    //                 id: task.id
    //             },
    //             data
    //         })
    //     })
    // }

    async update({body, taskId}) {

        console.log("Separator::update")
        console.log("taskId", taskId)
        console.log("body", body)

        let data = {
            separatorId: taskId,
            url: body.url,
            type: body.type.toUpperCase(),
        }
        if ( body.scanId){ 
            data.scanId = body.scanId
        }

        return this.prisma.vignette.create({
            data
        })


    }

}