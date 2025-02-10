


const { ScanType } = require('@prisma/client')


// export function isScanType(type: string): boolean {
//     // const prisma = new Prisma().client;
//     try {
//         // prisma.scanType.
//         if (Object.values(ScanType).includes(type)) {
//             // throw new Error(`Invalid type ${type}`)
//             return true;
//         }
//         return false; // Add this line to ensure a boolean is always returned
//     }
//     catch (error) {
//         console.log(error);
//         return false;
//     }
// }

function isScanType(type) {
  return Object.values(ScanType).includes(type)
}

  module.exports = { isScanType }

