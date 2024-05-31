
const { Prisma } = require('./client');
const { Tasks } = require("./tasks")

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

    // async get({taskId}) {
    //     console.log("taskId", taskId)
    //     // return 
    //     // let task = await this.prisma.separator.findUnique({
    //     let task = await this.prisma.task.findUnique({
    //             where:{
    //             id: taskId
    //         },
    //         // include:{
    //         // //     scan: true,
    //         // //     task: true,
    //         // //     // project: true,
    //         // //     // user: true
    //         //     vignette: true,
    //         // }
    //     })



    //     if ( task == null ) {
    //         throw new Error("Task not found")
    //     }

    //     console.log("task", task)

    //     task.vignette = task.vignette.map((vignette) => {
    //         console.log("vignette", vignette)

    //         vignette.type = vignette.type.toLowerCase(); 
    //         console.log("vignette.type", vignette.type)
    //         return vignette
    //     })

    //     console.log("task ->", task)

    //     return task
    // }

    async get({taskId}) {
        console.log("taskId", taskId)
        const task = await this.prisma.task.findUnique({
                where:{
                id: taskId
            }, 
        })

        if ( task == null ) {
            throw new Error("Task not found")
        }
        console.log("task", task)
        
        const scanId = task.params.scanId
        console.log("scanId", scanId)

        let vignettes = await this.prisma.vignette.findMany({
            where:{
                scanId
            }
        })

        if ( vignettes == null ) {
            // return { vignetts: [] }
            return []
        }

        vignettes = vignettes.map((vignette) => {
            console.log("vignette", vignette)

            vignette.type = vignette.type.toLowerCase(); 
            console.log("vignette.type", vignette.type)
            return vignette
        })

        console.log("vignettes ->", vignettes)

        // return { vignettes }
        return vignettes
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

        const task = await new Tasks().get({taskId: taskId})
    
        if ( !task ) throw new Error("Task not found")        
        console.log("task", task)

        let data = {
            separatorId: taskId,
            url: body.url,
            type: body.type.toUpperCase(),
            // scanId: task.subsampleid
            scanId: task.params.scanId
        }
        // on ne le passe pas à API Pipeline danc peux pas l'avoir dans body, parcontre comme fait avant il est dans la task
        // if ( body.scanId){ 
        //     data.scanId = body.scanId
        // }

        return this.prisma.vignette.create({
            data
        })

    }

}
