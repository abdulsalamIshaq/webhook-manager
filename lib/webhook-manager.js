"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookManager = void 0;
class WebhookManager {
    constructor() {
        this.drivers = {};
    }
    // Make sure only one of the class is instantiated
    static initialize() {
        if (!WebhookManager.instance) {
            WebhookManager.instance = new WebhookManager();
        }
        return WebhookManager.instance;
    }
    // Register or retrieve registered webhook driver
    driver(name, driver) {
        // Register driver if second parameter is not passed
        if (driver !== undefined) {
            this.drivers[name] = driver;
        }
        // return the registered webhook driver class 
        return this.getDriver(name);
    }
    // Get a webhook driver
    getDriver(name) {
        // return driver if driver exist 
        if (name in this.drivers) {
            return this.drivers[name];
        }
        // throw error if driver does not exist
        throw new Error(`${name} not found as a webhook driver`);
    }
    // Get all drivers
    getDrivers() {
        return this.drivers;
    }
    // Get the names of all registered drivers
    getDriversName() {
        return Object.keys(this.drivers);
    }
    // Checks if a driver is registered with the given name
    exists(name) {
        return this.getDriversName().includes(name);
    }
}
exports.WebhookManager = WebhookManager;
//# sourceMappingURL=webhook-manager.js.map