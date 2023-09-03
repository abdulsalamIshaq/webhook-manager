# webhook-manager
Webhook Manager is a versatile library designed for managing and processing multiple webhooks in Node.js. It can be implemented with various Node.js frameworks, including but not limited to Express.js, Fastify.js, Restify.js, Koa.js, and Hapi.js. However, please note that while it's compatible with many Node.js frameworks, it may not work seamlessly with every framework available.

Webhooks have become an essential component in modern web development, enabling real-time communication between systems. we'll explore how to efficiently manage multiple webhooks using the [webhook-manager](https://github.com/abdulsalamIshaq/webhook-manager) library in TypeScript with Express.js. By leveraging these tools, you can streamline the process of handling incoming webhook requests and ensure smooth communication between your applications.

### How to Implement the Webhook Manager Library with Express.js in TypeScript

To start, we need a TypeScript environment with the necessary dependencies. Here's a step-by-step guide to getting started:

1. Install Node.js and npm (Node Package Manager) on your system.
    
2. Create a new directory for your webhook manager project.
    
3. Open a terminal or command prompt, navigate to the project directory, and initialize a new npm project using `npm init`.
    

Now, let's install the required packages:

```shell
npm install express webhook-manager
```

After installing the necessary dependencies, let's create a new TypeScript file named `index.ts` to set up our Express server:

```typescript
import express from 'express';
import { WebhookManager } from "@olayanku/webhook-manager";

const app = express();
app.use(express.json());

const manager = WebhookManager.initialize();
```

The code above sets up Express and initializes a new instance of the `WebhookManager` class using the `initialize` method. This method ensures that only one instance of the `WebhookManager` class exists, following the singleton design pattern.

By instantiating the `WebhookManager` class, we gain access to its functionality for managing webhooks. We'll use this instance to handle webhook registrations and processing later in the tutorial.

**Registering webhook**

`manager.driver(name: string, driver?: WebhookInterface)`  
The `driver` method allows us to register and retrieve a webhook driver with the Webhook Manager. It accepts two parameters, where the second parameter is optional. If the second parameter is provided, it registers the webhook Otherwise, the method retrieves the registered webhook with the specified name. The two parameters are as follows:

1. **name:** The name we want to use to register the driver is the identifier that will be used to associate the webhook driver with the Webhook Manager. It allows us to uniquely identify and reference the driver when registering and managing webhooks.
    
    When registering the webhook driver with the Webhook Manager, we can choose any name that is meaningful and descriptive for our specific use case. This name should help us easily recognize and differentiate the driver if we have multiple drivers registered.
    
2. **driver:** The `driver` parameter is optional in the `` `register` `` method. It represents the driver class that we want to register with the Webhook Manager. If provided, it must be an instance of a class that implements the `WebhookInterface` interface. The `WebhookInterface` interface defines the required methods, such as `validate` and `process`, that the driver class must implement to process incoming webhook payloads.
    

**The WebhookInterface interface**

The `WebhookInterface` interface represents a webhook driver that handles incoming webhook payloads. It defines the structure and methods that a webhook driver class should implement to process and validate the webhook data. It has two methods as follows:

* `validate(request: object, response: object): boolean`: The `validate` method is responsible for validating the incoming webhook request. It receives the `request` and `response` of the incoming webhook as an argument and should return a boolean value indicating whether the payload is valid or not. This method allows you to perform any necessary validation checks on the webhook payload data.
    
* `process(request: object, response: object)`: void: The `process` method is responsible for processing the validated webhook payload and performing the desired actions based on the received data. It receives the `request` and `response` of the incoming webhook as an argument. Inside this method, you can implement specific logic to handle the webhook payload, such as updating a database, triggering notifications, or executing business operations.
    

Now that we understand all the necessary steps to register a webhook driver, let's proceed with registering a webhook driver.

Create a `/drivers` directory and create a `paystack.ts` file inside the directory and add the following code.

```typescript
import { Request, Response } from 'express';
import { WebhookInterface } from "@olayanku/webhook-manager";
import crypto from 'crypto';

class Paystack implements WebhookInterface {

    //validate webhook before processing
    validate(req: Request, res: Response): boolean {
        const hash = crypto.createHmac('sha512', secret).update(
                         JSON.stringify(req.body)
                     ).digest('hex');

        return hash == req.headers['x-paystack-signature'];
    }

    async process(req: Request, res: Response): Promise<void> {
        //process webhook
        res.send(200);
    }
}

export default Paystack;
```

After creating our webhook driver we can now proceed to register it.

Open `index.ts` and add the following code

```typescript
import express from 'express';
import { WebhookManager } from "@olayanku/webhook-manager";
import Paystack from "./drivers/paystack";

const app = express();
app.use(express.json());

const manager = WebhookManager.initialize();
manager.driver('paystack', new Paystack);
```

We have successfully registered our webhook driver. You can register multiple drivers as needed. However, for the sake of this tutorial, we will only register one driver.

The next step is to process the registered webhook drivers. Now, the question arises: how do we handle multiple webhooks simultaneously? In this tutorial, I will explain two approaches to accomplish this. However, it's important to note that the process of handling webhooks and managing errors ultimately depends on the developer's implementation. I encourage you to choose the approach that best suits your specific needs and requirements when handling webhooks.

Before proceeding, I will like to introduce you to some additional methods.

* `getDrivers(): { [name: string]: WebhookInterface }`: The method returns an object where the webhook name is used as the key, and the corresponding webhook driver is set as the value.
    
* `getDriversName(): string[]`: The method is used to retrieve the names of all registered drivers. It returns an array of strings representing the names of the registered drivers.
    
* `exists(name: string): boolean`: The method checks if a driver is registered with the given `name`. It determines whether a driver with the specified name is already registered or not.
    

1. **First approach**
    
    ```typescript
    const webhookDrivers = manager.getDrivers();
    
    manager.getDriversName().forEach((name) => {
        const webhook = webhookDrivers[name];
    
        app.post('/webhook/' + name, async (req: Request, res: Response) => {
            try {
                if (webhook.validate(res, req)) {
    
                    await webhook.process(req, res);
    
                    return res.status(200).json({
                        message: "successful"
                    });
                }
    
                return res.status(400).json({
                    message: "bad request"
                });
    
            } catch (error) {
                console.error(`Error processing webhook: ${error}`);
                return res.status(500).json({
                    message: "Internal Server Error"
                });
            }
        });
    });
    
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
    ```
    
    The above code retrieves the names of all registered webhook drivers and loops through them. Since each driver name serves as the key for its corresponding driver class, we use the name to retrieve each registered driver class. Then, we handle each driver using Express. Based on the code above all registered webhook will be accessible in `/webhook/${name}`
    
2. **Second Approach**
    
    ```typescript
    const webhookDrivers = manager.getDrivers();
    
    app.post('/webhook/:name', async (req: Request, res: Response) => {
        const { name } = req.params;
    
        if (!manager.exists(name)) {
            return res.status(400).json({
                message: name + " is not found as a webhook driver"
            });
        }
        
        const webhook = webhookDrivers[name];
        try {
            if (webhook.validate(res, req)) {
    
                await webhook.process(req, res);
    
                return res.status(200).json({
                    message: "successful"
                });
            }
    
            return res.status(400).json({
                message: "bad request"
            });
    
        } catch (error) {
            console.error(`Error processing webhook: ${error}`);
            return res.status(500).json({
                message: "Internal Server Error"
             });
        }
    });
    
    const PORT = process.env.PORT || 3000;
    
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
    ```
    
    The above code passes the name as a URL parameter and checks if the provided name is a valid webhook registered name. If the name is valid, it validates and processes the webhook; otherwise, it returns a 400 (bad request) status code.
    

In conclusion, we have explored the concept of webhooks and learned how to effectively manage multiple webhooks using the Webhook Manager library in TypeScript with Express.js. Webhooks have become an integral part of modern web development, enabling real-time communication between systems. By utilizing the Webhook Manager library, we can easily register and manage webhook drivers, handle incoming webhook requests, and ensure efficient and reliable webhook processing.

With this knowledge and understanding, you are now equipped to implement a webhook manager using TypeScript and Express.js, empowering you to handle webhooks efficiently and effortlessly in your own projects. Remember to refer back to this tutorial whenever you need a refresher or require assistance in managing webhooks effectively.

Happy coding!