import WebhookInterface from "../src/interface/webhook.interface";
import WebhookManager from "../src/webhook-manager";

describe("WebhookManager", () => {
    let webhookManager: WebhookManager;

    beforeEach(() => {
        webhookManager = new WebhookManager();
    });

    it("should throw an error if the driver is not found", () => {
        const getNonExistingDriver = () => {
            webhookManager["getDriver"]("nonExistingDriver");
        };

        expect(getNonExistingDriver).toThrow("nonExistingDriver not found as a webhook driver");
    });

    it("should set and return the driver for the given name", () => {
        const mockDriver: WebhookInterface = {
            event: "testEvent",
            validate: jest.fn(),
            process: jest.fn(),
        };

        webhookManager.driver("myDriver", mockDriver);

        expect(webhookManager["getDriver"]("myDriver")).toBe(mockDriver);
    });

    it("should throw an error if the driver is not found", () => {
        const getNonExistingDriver = () => {
            webhookManager["getDriver"]("nonExistingDriver");
        };

        expect(getNonExistingDriver).toThrowError(
            "nonExistingDriver not found as a webhook driver"
        );
    });

    it("should process the webhook if the driver validation succeeds", () => {
        const mockDriver: WebhookInterface = {
            event: "testEvent",
            validate: jest.fn().mockReturnValue(true),
            process: jest.fn(),
        };

        webhookManager.driver("myDriver", mockDriver);

        const testData = { /* Some test data */ };
        const testHeaders = { /* Some test headers */ };
        webhookManager.processWebhook("myDriver", testData, testHeaders);

        expect(mockDriver.validate).toHaveBeenCalledWith(testData, testHeaders);
        expect(mockDriver.process).toHaveBeenCalledWith(testData, testHeaders);
    });

    it("should not process the webhook if the driver validation fails", () => {
        const mockDriver: WebhookInterface = {
            event: "testEvent",
            validate: jest.fn().mockReturnValue(false),
            process: jest.fn(),
        };

        webhookManager.driver("myDriver", mockDriver);

        const testData = { /* Some test data */ };
        const testHeaders = { /* Some test headers */ };
        webhookManager.processWebhook("myDriver", testData, testHeaders);

        expect(mockDriver.validate).toHaveBeenCalledWith(testData, testHeaders);
        expect(mockDriver.process).not.toHaveBeenCalled();
    });
});
