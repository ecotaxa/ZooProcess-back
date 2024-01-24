// import { PrismaClient } from '@prisma/client'
const {PrismaClient} = require('@prisma/client')

// declare global {
    // var prismaGlobal /*: PrismaClient | undefined;*/
// }


const prismaOptions = {
    log: ['query'],
}



// module.exports.prisma = () => {
//     return new PrismaClient(prismaOptions)
// }

// export default prisma
module.exports.Prisma = class {

    constructor(){
        this.client = new PrismaClient(prismaOptions);
    }
}


// TS
// singleton pour ne pas créer durant le développement
// à cause du Hot Reload de multiple connexion à la DB
//
// import { PrismaCmlient } from "@prisma/client";
// declare global {
//     var prisma : PrismaClient | undefined;
// }

// export const db = globalThis.prisma || new PrismaClient(prismaOptions);

// if (process.env.NODE_ENV !== "production") globalThis.prisma = db;




// JS Singleton

// var Prisma = (function () {
//     var instance;

//     function createInstance() {
//         var object = new PrismaClient(prismaOptions);;
//         return object;
//     }

//     return {
//         getClient: function () {
//             if (!instance) {
//                 instance = createInstance();
//             }
//             return instance;
//         }
//     };
// })();

// function run() {

//     var instance1 = Prisma.getClient();
//     var instance2 = Prisma.getClient();

//     console.log("Same instance? " + (instance1 === instance2));
// }
