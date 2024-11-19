
class Separate {

async run(data, bearer, taskInstance){

    console.log("tasks::separate", data)
    // this.prisma.separate()

    const taskId = data.id

    // const 

    // this.prisma.task.upsert({
    //     where:{
    //         id: taskId
    //     },
    //     update:{
    //         status: "RUNNING",
    //         // task.params.separator: 
    //     }
    // })
    taskInstance.setTaskStatus(taskId, {status:"RUNNING",log:"running"})


    let srcFolder = ""
    let dstFolder = ""
    if ( data.params.src == null || data.params.dst == null /*|| data.params.projectid == null*/){

    // ici je connais les données, mais ai je toutes les infos ?
        const project = await this.prisma.project.findFirst({
            where:{
                id: data.params.projectid
            },
            include:{
                drive: true,
                samples: true,
            }
        })
        console.log("project", project)

        if (project == null){
            throw new Error(`project ${data.params.projectid} not found.`)
        }

        // let driveurl = "" ;//project.drive.url
        // if (project.drive){
        //     driveurl = project.drive.url
        // } else {
        //     const drive = await this.prisma.drive.findFirst({
        //         where:{
        //             id: project.driveId
        //         }
        //     })
        //     if (drive == null){
        //         throw new Error("Cannot determine the drive url")
        //     }
        //     driveurl = drive.url
        // }

        const driveurl = project.drive.url
        console.log("driveurl", driveurl)

        const sample_name = project.samples.filter(sample => sample.id == data.params.sampleid)[0].name
        console.log("sample_name", sample_name)


        srcFolder = `${driveurl}/${project.name}Zooscan_scan/_work/${sample_name}/` + "/multiples_to_separate"
        console.log("srcFolder", srcFolder)

        srcFolder = "/Users/sebastiengalvagno/Drives/Zooscan/Zooscan_dyfamed_wp2_2023_biotom_sn001/Zooscan_scan/_work/dyfamed_20230111_200m_d1_1/multiples_to_separate/"
        console.log("HARD CODED: folder", srcFolder)
        // const data = {
        //     folder,
        
    // }
    } else {
        srcFolder = data.params.src
        dstFolder = data.params.dst
    }



    console.log("CALL HAPPY PIPELINE /separate/")
    console.debug("Trace")
    console.trace()
fetch(this.happyPipelineUrl+"separate/", {
    // method: 'POST',
    method: 'PUT',
    body: JSON.stringify({ path: srcFolder }),
    headers: { 
        'Content-type': 'application/json; charset=UTF-8',
        "Authorization": authHeader 
    },
})
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch(error => {
        console.log(error)
        console.log("taskId:", taskId)

        return new Promise((resolve, reject) => { reject(`Cannot launch the task ${taskId} | Error: ${error}`)});
    })

    const url = `${this.zooProcessApiUrl}task/${taskId}`
    const message = `Launched | Take a look at ${url}`

    const returndata = {
        //     status:200,
        //     data: { message }
        message,
        url,
        taskId
    }
    // console.log("returndata", returndata)
    // console.log("message", message)
    //return new Promise().resolve(message)
    // return returndata
    // return new Promise().resolve(message)
    // return message

    return new Promise(function(resolve, reject) {
        // return resolve(message)
        return resolve(returndata)
    })
}



}

module.exports = { Separate } 
