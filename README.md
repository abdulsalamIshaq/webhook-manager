# webhook-manager
Webhook Manager is a simple Library for managing and processing multiple webhook in node which can be implement with most node.js framework eg. express.js, fastify.js, restify.js, Koa.js, hapi.js etc... but not all node.js framework


# Webhook Manager Components
The webhook manager has two component 
1. The **WebhookManager** Class
2. The **WebhookInterface**

## WebhookManager Class
The WebhookManager is uisng the singleton design pattern and it is responsible for registering and retriving webhook driver and it has 3 method, listed below.

1. The **initialize()** method
2. The **driver()** method
3. The **getDrivers()** method

### The intialize method

This method is responsible for instantiating new WebhookManager instance and it ensures that only one instance of the class exists
```
const manager = WebhookManager.initialize();
```

### The driver method
This method is responsible for registering and registering webhook driver, it has two parameter
```
driver(name: string, driver?: WebhookInterface): WebhookInterface
```
The first parameter accept string which is the driver name you want to register or retreive.

The second parameter is an optional parameter accept and instance of **WebhookInterface**

### The getDrivers method
This method is responsible for reteriving all registered drivers 
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
To validate and process we need to pass request and response which can be gotten when we use an external framework
```
if(myDriver.validate(request, response)) {
    return await myDriver.process(request, response)
}
```

[Here](https://github.com/abdulsalamIshaq/webhook-manager-example) is an example of how to use the webhook with express.js 