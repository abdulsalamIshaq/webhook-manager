import { WebhookInterface } from "./interface/webhook.interface";
declare class WebhookManager {
    private drivers;
    private static instance;
    private constructor();
    static initialize(): WebhookManager;
    driver(name: string, driver?: WebhookInterface): WebhookInterface;
    protected getDriver(name: string): WebhookInterface;
    getDrivers(): {
        [name: string]: WebhookInterface;
    };
    getDriversName(): string[];
    exists(name: string): boolean;
}
export { WebhookManager };
