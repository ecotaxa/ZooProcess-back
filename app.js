const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Ajoutez ce code au début, juste après les imports
const disableDebugLog = () => {
  // Save the original console.debug
  const originalDebug = console.debug;

  // Override console.debug based on environment variable
  if (process.env.DEBUG !== 'true') {
    console.debug = function() {};
  } else {
    console.debug = originalDebug;
  }
}

disableDebugLog()

const { Users } = require("./services/users");

const {
  middleware: openApiMiddleware,
  resolvers,
} = require('express-openapi-validator');

const container = require('./services/container');
const {Background} = require('./services/background');
const {Scans} = require('./services/prisma/scans');
const {Tasks} = require('./services/Tasks/tasks');
const { Samples } = require('./services/samples'); 
const { SubSamples } = require('./services/subsamples');
// const errorHandler = require('./middleware/errorHandler');
//const DriveAccessException = require('./exceptions/DriveAccessException');


container.register('samples', new Samples());
container.register('background', new Background());
container.register('scans', new Scans());
container.register('tasks', new Tasks());
container.register('subsamples', new SubSamples());


const port = 8081;
const app = express();
// const apiSpec = path.join(__dirname, 'api.yaml');
const apiSpec = path.join(__dirname, 'zooprocess.openapi.yaml');


function verifyToken (req, res, next){

  console.debug("verifyToken middleware")

  // console.debug("req.path", req.path)

  // console.debug("req.headers", req.headers)
  const bearerHeader = req.headers [ "authorization" ];
  // console.debug("Bearer header: ", bearerHeader)
  if (typeof bearerHeader !== 'undefined' ) {
    const bearer = bearerHeader .split(' ');
    const bearerToken = bearer[1];

    // console.debug("Bearer found : ", bearerToken);

    req.token = bearerToken;
    next ();
  }else{
    // res. sendstatus
    console.log("No Bearer")
    next();
    // res.sendStatus(403);
  }
}


function extractJWT(req, res, next){

  if ( req.token ){
    // console.log("secret: ", process.env.JWT_SECRET)
    // console.log("have token " , typeof(req.token))

    // console.debug("jwt.decode()", jwt.decode(req.token))

    jwt.verify (req.token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        console.error("Error", err.message)
        console.error("Error", err.name)
        console.error("Error", err.expiredAt)
        // if (err.name.includes("jwt expired") ){
        if (err.name == "TokenExpiredError" ) {
          console.error("Error Token", err)
          // res.status(498).send("Token expired") // 498 used by Nginx
          // res.status(401).send("Token expired")
          res.status(401).json({
            error: true,
            message: "Your session has expired. Please log in again.",
            code: "AUTH_TOKEN_EXPIRED"
          })
          // next()
          /*
          Missing token <=> Missing identity card <=> Rejected because of identity card check <=> 401
          Expired token <=> Expired identity card <=> Rejected because of identity card check <=> 401
          Malformed token <=> Unreadable/damaged identity card <=> Rejected because of identity card check => 401
          User doesn't have privilege for the resource <=> Passenger is not allowed to access this plane <=> Not rejected because of identity card check => 403
          You banned a user <=> Passenger is blacklisted <=> Not rejected because of identity card check => 403
          */
        }
        else {
          // res.sendStatus(403)
          res.status(403).json({
            error: true,
            message: "You don't have permission to access this resource.",
            code: "AUTH_FORBIDDEN"
          })
          // next(); // pas le next sinon passe au midleware suivant et l'erreur n'est pas traité
        }
      }
      else {
        //res.json({
        //  message: "Welcome to Profile",
        //    userData: authData
        //})
        // console.debug("JWT: ", authData)
        req.jwt = authData;
        next();
      }
    })
  }
  else {

    // console.log("no token")
    next();
  }
}


async function getRole(req, res, next){
  if ( req.jwt ){

    id = req.jwt.id
    console.debug("getRole id: ", id)
    const users = new Users();
    await users.get(id)
    .then( user => {
      console.debug("user:", user.name)
      console.debug("user.role: ", user.role)

      //req.jwt.role = user.role
      switch (user.role) {
        case "ADMIN":
          req.jwt.role = "Manager" // "admin"
          break;
        case "MANAGER":
          req.jwt.role = "Manager"
          break;
        case "USER":
          req.jwt.role = "User"
          break;
        default:
          req.jwt.role = "User"
      }
      console.debug("user.role mapped: ", req.jwt.role)

      next()
    })
    .catch(async(e) => {
        console.error("Can't find user: ", e );
        // return res.status(500).json({error:e});

        res.sendStatus(401)
        // res.status(err.status || 500).json({
        //   message: err.message,
        //   errors: err.errors,
        // });
        // next()
    })
  }
  else { // else is neccessary to avoid error
    console.debug("getRole - no token")
    next()
  }
}

// function isRoleAllowed(req,res,next){

//   const allowedRoles = req.openapi.schema.tags;
//   const role = req.jwt.role
//   console.log("role: ", role)
//   console.log("TAGS", allowedRoles);

//   if (allowedRoles.includes(role)) {
//     next()
//   } else {
//     res.sendStatus(401)
//   }
// }

// function role(req,res,next){

//   console.log("req:", req)
//   next()
//   // console.log(": ", req.jwt.role)
//   // if ( req.jwt.role == "admin" ){
//   //   next()
//   // }else{
//   //   res.sendStatus(401)
//   // }
// }

// function testRole(req){

//   const allowedRoles = req.openapi.schema.tags;
//   console.log("TAGS", allowedRoles);

//   return allowedRoles.includes(role) ? true : false
// }


// ne peux pas fonctionner car c'est juste un constructeur de route
// vers la fonction à appeler
// function modulePathResolverSeb(
//   handlersPath,//: string,
//   route,//: RouteMetadata,
//   apiDoc//: OpenAPIV3.Document,
// )/*: RequestHandler*/ {

//   const pathKey = route.openApiRoute.substring(route.basePath.length);
//   const schema = apiDoc.paths[pathKey][route.method.toLowerCase()];

//   // const allowedRoles = req.openapi.schema.tags;
//   const allowedRoles = schema['tags']
//   console.log("TAGS", allowedRoles);
//   const role = req.jwt.role
//   console.log("role: ", role)

//   if (allowedRoles.includes(role)) {
//     next()
//   } else {
//     //res.sendStatus(401)
//     throw new Error ("Not allowed")
//   }

//   const [controller, method] = schema['operationId'].split('.');

//   const modulePath = path.join(handlersPath, controller);
//   const handler = require(modulePath);

//   if (handler[method] === undefined) {
//     throw new Error(
//       `Could not find a [${method}] function in ${modulePath} when trying to route [${route.method} ${route.expressRoute}].`,
//     );
//   }

//   return handler[method];
// }

// console.log("modulePathResolverSeb ok")
var corsOption = {
  origin: 'http://zooprocess.imev-mer.fr',
  optionSuccessStatus: 200 // for legacy browser
}
// app.use (cors(corsOption))
app.use(cors())

// console.log("cors ok")

// 1. Install bodyParsers for the request types your API will support
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

// console.log("bodyParsers ok")

app.use(logger('dev'));

// console.log("logger ok")

app.use('/spec', express.static(apiSpec));

app.use(verifyToken)
app.use(extractJWT)
app.use(getRole)
// app.use(isRoleAllowed)

// console.log("verifyToken ok")

//  2. Install the OpenApiValidator middleware
app.use(
  openApiMiddleware({
    apiSpec,
    validateResponses: true, //true ,// testRole(req), // default false
    operationHandlers: {
      // 3. Provide the path to the controllers directory
      basePath: path.join(__dirname, 'routes'),
      // 4. Provide a function responsible for resolving an Express RequestHandler
      //    function from the current OpenAPI Route object.
      resolver: resolvers.modulePathResolver,
      // resolver: modulePathResolverSeb
    },
  }),
);

// 5. Create a custom error handler
app.use((err, req, res, next) => {
  // format errors
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});
// app.use(errorHandler);
// app.use((err, req, res, next) => {
//   const statusCode = err.status || 500;
  
//   // Create response object
//   const errorResponse = {
//     message: err.message,
//     errors: err.errors
//   };
  
//   // Add specific properties for custom error types
//   if (err instanceof DriveAccessException) {
//     errorResponse.url = err.url;
    
//     // Include stack trace in development or when debug is requested
//     if (process.env.NODE_ENV !== 'production' || req.query.debug === 'true') {
//       errorResponse.stack = err.stack;
//     }
//   }
  
//   res.status(statusCode).json(errorResponse);
// });

http.createServer(app).listen(port);
console.log(`Listening on port ${port}`);

module.exports = app;
