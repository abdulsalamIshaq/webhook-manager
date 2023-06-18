import { WebhookInterface } from "./interface/webhook.interface";

class WebhookManager {
    private drivers: { [name: string]: WebhookInterface } = {};

    private static instance: WebhookManager;

    private constructor() {
    }

    // Make sure only one of the class is instantiated
    public static initialize(): WebhookManager {
        if (!WebhookManager.instance) {
            WebhookManager.instance = new WebhookManager();
        }

        return WebhookManager.instance;
    }

    // Register or retrieve registered webhook driver
    driver(name: string, driver?: WebhookInterface): WebhookInterface {

        // Register driver if second parameter is not passed
        if (driver !== undefined) {
            this.drivers[name] = driver;
        }

        // return the registered webhook driver class 
        return this.getDriver(name);

    }

    // Get a webhook driver
    protected getDriver(name: string): WebhookInterface {

        // return driver if driver exist 
        if (name in this.drivers) {
            return this.drivers[name];
        }

        // throw error if driver does not exist
        throw new Error(`${name} not found as a webhook driver`);

    }

    // Get all drivers
    getDrivers(): { [name: string]: WebhookInterface } {
        return this.drivers;
    }

    // Get the names of all registered drivers
    getDriversName(): string[] {
        return Object.keys(this.drivers);
    }

    // Checks if a driver is registered with the given name
    exists(name: string): boolean {
        return this.getDriversName().includes(name);
    }


}

export {
    WebhookManager
};