const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const {
  middleware: openApiMiddleware,
  resolvers,
} = require('express-openapi-validator');

const port = 8081;
const app = express();
// const apiSpec = path.join(__dirname, 'api.yaml');
const apiSpec = path.join(__dirname, 'zooprocess.openapi.yaml');

function verifyToken (req, res, next){

  console.log("verifyToken middleware")

  const bearerHeader = req.headers [ "authorization" ];
  if (typeof bearerHeader !== 'undefined' ) {
    const bearer = bearerHeader .split(' ');
    const bearerToken = bearer[1];

    console.log("Bearer found : ", bearerToken);

    req.token = bearerToken;
    next ();
  }else{
    // res. sendstatus
    console.log("No Bearer")
    next();
  }
}

function extractJWT(req, res, next){

  if ( req.token ){
    console.log("have token " , typeof(req.token))
    jwt.verify (req.token, 'secret', (err, authData) => {
      if (err) {
        console.log("Error Token", err)
        res.sendStatus (403);
      } else {
        //res.json({
        //  message: "Welcome to Profile",
        //    userData: authData
        //})
        console.log("JWT: ", authData)
        req.jwt = authData;
      }
    })
    next();
  }
  else {
    console.log("no token")
    next();
  }
}

var corsOption = {
  origin: 'http://zooprocess.imev-mer.fr',
  optionSuccessStatus: 200 // for legacy browser
}
// app.use (cors(corsOption))
app.use(cors())

// 1. Install bodyParsers for the request types your API will support
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use(logger('dev'));

app.use('/spec', express.static(apiSpec));

app.use(verifyToken)
app.use(extractJWT)

//  2. Install the OpenApiValidator middleware
app.use(
  openApiMiddleware({
    apiSpec,
    validateResponses: true, // default false
    operationHandlers: {
      // 3. Provide the path to the controllers directory
      basePath: path.join(__dirname, 'routes'),
      // 4. Provide a function responsible for resolving an Express RequestHandler
      //    function from the current OpenAPI Route object.
      resolver: resolvers.modulePathResolver,
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

http.createServer(app).listen(port);
console.log(`Listening on port ${port}`);

module.exports = app;
