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
Any driver that need to be register need to implement the WebhookInterface
```
interface WebhookInterface {
    path: string;
    validate(request: object, response: object): boolean;
    process(request: object, response: object): void;
}

```

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