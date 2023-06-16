# webhook-manager
Webhook Manager is a versatile library designed for managing and processing multiple webhooks in Node.js. It can be implemented with various Node.js frameworks, including but not limited to express.js, fastify.js, restify.js, Koa.js, and hapi.js. However, please note that it may not be compatible with every Node.js framework available.

# Webhook Manager Components
The webhook manager has two component 
1. The **WebhookManager** Class
2. The **WebhookInterface**

## WebhookManager Class
The WebhookManager utilizes the singleton design pattern and is responsible for registering and retrieving webhook drivers. It provides three methods, listed below:

1. The **initialize()** method
2. The **driver()** method
3. The **getDrivers()** method

### The intialize method

This method is responsible for instantiating a new instance of the WebhookManager class and ensuring that only one instance of the class exists. It follows the singleton design pattern to achieve this purpose.
```
const manager = WebhookManager.initialize();
```

### The driver method
This method is responsible for registering and retrieving a webhook driver. It accepts two parameters.
```
driver(name: string, driver?: WebhookInterface): WebhookInterface
```
The first parameter of the method accepts a string, which represents the driver name that you want to register or retrieve.

The second parameter is optional and accepts an instance of the **WebhookInterface**.

### The getDrivers method
This method is responsible for retrieving all the registered drivers.
```
getDrivers(): { [name: string]: WebhookInterface }
```
## WebhookInterface
All webhook driver is required to implement the WebhookInterface and it has one property and two method
1. path
2. validate()
3. process()
```
interface WebhookInterface {
    path: string;
    validate(request: object, response: object): boolean;
    process(request: object, response: object): void;
}

```
### path property
This is the path where the webhook will be accessible. example
```
import { WebhookInterface } from "webhook-manager";

class Driver implements WebhookInterface {
    path: string = "/driver";
    ...
}

export default Driver;
```
From the above example this means the webhook will be accessible in /driver path
### validate method
This method is require for validating the webhook if its truely from the actual source, it requires two parameter the request and the response and it return a boolean value
```
validate(request: object, response: object): boolean;
```
An express.js example on how to validate paystack webhook
```
import { Request, Response } from 'express';
import { WebhookInterface } from "webhook-manager";
import crypto from 'crypto';

class Paystack implements WebhookInterface {

    path: string = "/paystack";
    
    validate(request: Request, response: Response): boolean {
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

        return hash == req.headers['x-paystack-signature'];
    }
    
    ...

}
export default Paystack;

```
### process method
This method is responsible for processing the webhook, it requires two parameter the request and response 
# How to Use the Webhook Manager
#### Intialize webhook manager instance in your root file
```
const manager = WebhookManager.initialize();
```
#### Create new webhook driver
```
import { WebhookInterface } from "webhook-manager";

class Driver implements WebhookInterface {
    path: string = "/driver";

    validate(req: object, res: object): boolean {
        // validate webhook before processing
        return true
    }
    async process(req: object, res: object): Promise<void> {
        // process webhook
        console.log(req.body);
    }
}

export default Driver;
```
#### register the webhook driver
```
manager.driver('my-driver', new Driver);
```
### Retreive registered webhook
```
const myDriver = manager.driver('my-driver')
```
After retreiving the registered webhook you have access to the validate and process method
### Validate and process webhook
To validate and process webhook requests, you need to pass the request and response objects, which are typically obtained when using an external framework.

When integrating the WebhookInterface with an external framework, such as Express.js or any other Node.js framework, you can obtain the request and response objects from the framework's request handler or middleware. These objects contain the necessary information and methods to handle the incoming webhook request and send the response back.
```
if(myDriver.validate(request, response)) {
    return await myDriver.process(request, response)
}
```

[Here](https://github.com/abdulsalamIshaq/webhook-manager-example) is an example of how to use the webhook with express.js 