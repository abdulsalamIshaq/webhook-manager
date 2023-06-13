import WebhookInterface from "./interface/webhook.interface";

class webhookManager {
    private drivers: { [name: string]: WebhookInterface } = {};

    driver(name: string, driver: WebhookInterface | null): WebhookInterface {
        if (driver !== null) {
            this.drivers[name] = driver;
        }
        return this.getDriver(name);

    }

    protected getDriver(name: string): WebhookInterface {

        if (name in this.drivers) {
            return this.drivers[name];
        }

        throw new Error(`${name} not found as a webhook driver`);

    }

    processWebhook(name: string, data: object, headers: object): void {
        const webhook = this.driver(name, null);

        if (webhook.validate(data, headers)) {
            return webhook.process(data, headers);
        }

    }
}

export default webhookManager;