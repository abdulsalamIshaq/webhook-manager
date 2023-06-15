interface WebhookInterface {
    path: string;
    validate(request: object, response: object): boolean;
    process(request: object, response: object): void;
}

export default WebhookInterface