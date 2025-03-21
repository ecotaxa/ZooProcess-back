class DataNotValidException extends Error {
    constructor(message/*:string*/) {
        super(message);
        this.name = 'DataNotValidException';
        // this.status = 416;
    }
}

module.exports = DataNotValidException;


