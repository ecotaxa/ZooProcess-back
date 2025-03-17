class Container {
    constructor() {
        this.services = new Map();
    }

    register(name, service) {
        this.services.set(name, service);
    }

    get(name) {
        // cannot do this because use class call before container is filled in constructor
        // if (!this.services.has(name)) {
        //     throw new Error(`Service ${name} not found. Please register it first.`);
        // }
        return this.services.get(name);
    }
}

module.exports = new Container();
