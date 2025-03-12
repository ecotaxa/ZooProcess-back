
```bash
curl http://localhost:3000/v1/projects
```


# example

example using express-openapi-validator with custom operation resolver


## [Example Express API Server: with custom operation resolver](https://github.com/cdimascio/express-openapi-validator/tree/master/examples/5-custom-operation-resolver)

By default, when you configure `operationHandlers` to be the base path to your operation handler files, we use `operationId`, `x-eov-operation-id` and `x-eov-operation-handler` to determine what request handler should be used during routing. 

If you ever want _FULL_ control over how that resolution happens (e.g. you want to use your own extended attributes or simply rely on `operationId`), then here's how you can accomplish that following an example where our `operationId` becomes a template that follows `{module}.{function}`.

- First, specifiy the `operationHandlers` option to be an object with a `basePath` and `resolver` properties. `basePath` is the path to where all your handler files are located. `resolver` is a function that **MUST** return an Express `RequestHandler` given `basePath` and `route` (which gives you access to the OpenAPI schema for a specific Operation)

```javascript
new OpenApiValidator({
  apiSpec,
  operationHandlers: {
    basePath: path.join(__dirname, 'routes'),
    resolver: (basePath, route) => {
      // Pluck controller and function names from operationId
      const [controllerName, functionName] = route.schema['operationId'].split('.')
      // Get path to module and attempt to require it
      const modulePath = path.join(basePath, controllerName);
      const handler = require(modulePath)
      // Simplistic error checking to make sure the function actually exists
      // on the handler module
      if (handler[functionName] === undefined) {
        throw new Error(
          `Could not find a [${functionName}] function in ${modulePath} when trying to route [${route.method} ${route.expressRoute}].`
        )
      }
      // Finally return our function
      return handler[functionName]
    }
});
```
- Next, use `operationId` to specify the id of operation handler to invoke.
```yaml
/projects:
  get:
    # This means our resolver will look for a file named "projects.js" at our 
    # configured base path and will return an export named "list" from 
    # that module as the Express RequestHandler.
    operationId: project.list
```
- Finally, create the express handler module e.g. `routes/projects.js`
```javascript
module.exports = {
  // the express handler implementation for the projects collection
  list: (req, res) => res.json(/* ... */),
};
```



# Prisma 
On model change, to get update we need to use several commands :
```
npx prisma generate
npx prisma db push
```
restart the application : npm run dev


# Prisma error list

https://www.prisma.io/docs/reference/api-reference/error-reference


# Mongo

## how to connect to the DB
```
mongosh --host zooprocess.imev-mer.fr --username root --password example
```

## Example how to access the data
```
use ZooProcess
db.Project.find()
db.Project.find({"name":"monproject2"})
db.Project.find({"id":"6565b055ae8de1c051ae0ed0"})
```





# openapi

http://zooprocess.imev-mer.fr:8081/spec



# docker  

## build
```
docker build -t zooprocess-back .
```
## run
```
docker run -p 8081:8081  --name zooprocess-back zooprocess-back
```







# MongoDB Tips
```
show databases;

use zooProcess;
show collections;

show the collection ZoooscanCalibration
db.ZoooscanCalibration.find().limit(5).pretty()

db.Instrument.find().limit(1).pretty()
```

for example to update broken table due to change model
I broken ZoooscanCalibration collection, when i added the frame type and link with the intrument collection

then I added the new fields: the frame type and the link with the intrument collection in each ZooscanCalibration rows
```
db.ZooscanCalibration.updateMany(
  {},
  { $set: { frame: "LARGE", instrumentId: ObjectId("65c4e0994653afb2f69b11ce") } }
)
```


# Prisma tips

## Visual DB Editor
```bash
npx prisma studio
```




# Mongo change admin password
```bash
mongosh -u root -p example
```

```mongosh
use admin
db.changeUserPassword("root", "your_new_password")
```

then update your .env file with the new password
DATABASE_URL="mongodb://root:your_new_password@localhost/zooProcess?authSource=admin"




# Create a DB

To create a new MongoDB database for this project:

Start MongoDB shell:
```bash
mongosh
```

Create and switch to your new database:
```mongosh
use zooprocess_db
db.createCollection("users")
```

Update your DATABASE_URL in .env file:
DATABASE_URL="mongodb://localhost:27017/zooprocess_db"


Run Prisma migration to create the collections:
```bash
npx prisma db push
```

The database is now ready to use with all the models defined in your schema.prisma file.


# run in docker
docker-compose up -d --build

