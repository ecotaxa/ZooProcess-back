class MissingDataException extends Error {
    constructor(message/*:string*/) {
        super(message);
        this.name = 'MissingDataException';
        // this.status = 422;
    }
}

module.exports = MissingDataException;

