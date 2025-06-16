class DataNotValidException extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'DataNotValidException';

    const payload = Array.isArray(details) ? details : [details];

    Object.defineProperty(this, 'errors', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: payload
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DataNotValidException);
    }
  }

  toJSON() {
    return {
      message: this.message,
      errors: this.errors
    };
  }
}

module.exports = DataNotValidException;
