import WebhookInterface from "../src/interface/webhook.interface";
import WebhookManager from "../src/webhook-manager";

describe("WebhookManager", () => {
    let webhookManager: WebhookManager;

    beforeEach(() => {
        webhookManager = WebhookManager.initialize();
    });

    test('should return an empty object if no drivers are added', () => {
        const drivers = webhookManager.getDrivers();

        expect(drivers).toEqual({});
    });

    it("should throw an error if the driver is not found", () => {
        const getNonExistingDriver = () => {
            return webhookManager.driver("nonExistingDriver");
        };

        expect(getNonExistingDriver).toThrow("nonExistingDriver not found as a webhook driver");
    });

    test('should return drivers object', () => {
        const mockDriver: WebhookInterface = {
            path: "/testPath",
            validate: jest.fn(),
            process: jest.fn(),
        };

        const driver1Name = 'driver1';
        const driver2Name = 'driver2';
        const mockDriver1 = mockDriver;
        const mockDriver2 = mockDriver;

        webhookManager.driver(driver1Name, mockDriver1);
        webhookManager.driver(driver2Name, mockDriver2);

        const drivers = webhookManager.getDrivers();

        expect(drivers).toEqual({
            [driver1Name]: mockDriver1,
            [driver2Name]: mockDriver2,
        });
    });

    it("should set and return the driver for the given name", () => {
        const mockDriver: WebhookInterface = {
            path: "/testPath",
            validate: jest.fn(),
            process: jest.fn(),
        };

        webhookManager.driver("myDriver", mockDriver);

        expect(webhookManager.driver("myDriver")).toBe(mockDriver);
    });

    it("should throw an error if the driver is not found", () => {
        const getNonExistingDriver = () => {
            webhookManager.driver("nonExistingDriver");
        };

        expect(getNonExistingDriver).toThrowError(
            "nonExistingDriver not found as a webhook driver"
        );
    });

});
