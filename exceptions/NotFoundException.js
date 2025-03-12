class NotFoundException extends Error {
    constructor(message/*:string*/) {
        super(message);
        this.name = 'NotFoundException';
        // this.status = 404;
    }
}

// export default NotFoundException;
module.exports = NotFoundException;

