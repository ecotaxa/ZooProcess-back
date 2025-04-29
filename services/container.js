class Container {
    constructor() {
        this.services = new Map();
    }

    register(name, service) {
        console.log("registering service: ", name)
        this.services.set(name, service);
    }

    get(name) {
        // cannot do this because use class call before container is filled in constructor
        // if (!this.services.has(name)) {
        //     throw new Error(`Service ${name} not found. Please register it first.`);
        // }
        // return this.services.get(name);
        const service = this.services.get(name);

        if (!service) {
            // throw new Error(`Service ${name} not found. Please register it first.`);
            console.error(`Service ${name} not found. Please register it first.`);
        }
        return service;
    }
}

module.exports = new Container();
