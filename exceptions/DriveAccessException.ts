import { error } from "console";

class DriveAccessException extends Error {

    readonly url : string
    // readonly stack: string; // inheritance from Error

    constructor(message: string, url:string) {
        super(message);
        this.name = 'DriveAccessException';
        this.url = url

        // Capture stack trace - this ensures proper stack trace in V8 engines
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DriveAccessException);
        }
        // Make stack property enumerable so it's included in JSON.stringify
        Object.defineProperty(this, 'stack', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.stack
        });
    }
}

// Use CommonJS export style for compatibility with existing JS imports
export = DriveAccessException;
