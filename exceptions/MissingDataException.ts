// "use strict";
// class MissingDataException extends Error {
//     constructor(message/*:string*/) {
//         super(message);
//         this.name = 'MissingDataException';
//         // this.status = 422;
//     }
// }

// module.exports = MissingDataException;


class MissingDataException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MissingDataException';
    }
}

// Use CommonJS export style for compatibility with existing JS imports
export = MissingDataException;
