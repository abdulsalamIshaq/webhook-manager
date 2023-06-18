import { WebhookInterface, WebhookManager } from "../src/index";

describe("WebhookManager", () => {
    let webhookManager: WebhookManager;

    let mockDriver: WebhookInterface;

    beforeEach(() => {
        webhookManager = WebhookManager.initialize();

        mockDriver = {
            validate: jest.fn(),
            process: jest.fn(),
        };
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

    it("should return an array of driver names", () => {

        const result = webhookManager.getDriversName();

        expect(result).toEqual(Object.keys(webhookManager.getDrivers()));
    });

    it("should return true if a driver exists with the given name", () => {
        let webhook = webhookManager.getDriversName()[0];

        if (!webhook) {
            webhook = 'myDriver';
            webhookManager.driver(webhook, mockDriver)
        }

        const result = webhookManager.exists(webhook);

        expect(result).toBe(true);
    });

    it("should return false if a driver does not exist with the given name", () => {

        const result = webhookManager.exists("unknownDriver");

        expect(result).toBe(false);
    });

});
