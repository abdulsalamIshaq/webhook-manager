import WebhookInterface from "./interface/webhook.interface";

class WebhookManager {
    private drivers: { [name: string]: WebhookInterface } = {};

    private static instance: WebhookManager;

    private constructor() {
    }

    public static initialize(): WebhookManager {
        if (!WebhookManager.instance) {
            WebhookManager.instance = new WebhookManager();
        }

        return WebhookManager.instance;
    }

    driver(name: string, driver?: WebhookInterface): WebhookInterface {
        if (driver !== undefined) {
            this.drivers[name] = driver;
        }
        return this.getDriver(name);

    }

    getDrivers(): { [name: string]: WebhookInterface } {
        return this.drivers;
    }

    protected getDriver(name: string): WebhookInterface {

        if (name in this.drivers) {
            return this.drivers[name];
        }

        throw new Error(`${name} not found as a webhook driver`);

    }

}

export default WebhookManager;