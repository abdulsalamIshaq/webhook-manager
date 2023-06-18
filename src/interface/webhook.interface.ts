interface WebhookInterface {
    validate(request: object, response: object): boolean;
    process(request: object, response: object): void;
}

export {
    WebhookInterface
}