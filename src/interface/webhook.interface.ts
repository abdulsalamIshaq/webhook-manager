interface WebhookInterface {
    event(): string;
    validate(data: object, headers: object): boolean;
    process(data: object, headers: object): void;
}

export default WebhookInterface