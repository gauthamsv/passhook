//http
const http = require('http');
const fs = require('fs');

//const options = {
  //key: fs.readFileSync('key.pem'),
  //cert: fs.readFileSync('cert.pem')
//};
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
//const port = process.env.PORT || 3000 ;
const listener = app.listen(process.env.PORT || 3000 , () => {
  console.log("Your app is listening on port " + listener.address().port);
});
//https.createServer(options, function (req, res) {
//}).listen(8080);

//****************************
// added code for Password Import Inline hook

const users = require('./users');
const { body, validationResult } = require('express-validator');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const basicAuth = require('express-basic-auth');
app.use(basicAuth({
  users: { 'admin': 'supersecret'},
  unauthorizedResponse: req => 'Unauthorized'
}));


const passwordImportValidation = [
  body('data.context.credential.username', 'Must be a non empty string').exists().bail().isString().bail().notEmpty(),
  body('data.context.credential.password', 'Must be a non empty string').exists().bail().isString().bail().notEmpty(),
];

app.post('/passwordImport', passwordImportValidation, (req, res) => {
  console.log(" ");
  var loginName = req.body.data.context.credential['username'];
  var loginPass = req.body.data.context.credential['password'];
  console.log('Password for ' +  loginName+ ":  " + loginPass);
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const credentials = req.body.data.context.credential;
  
  if (users.validate(credentials.username, credentials.password)) {
    console.log("Password verified! Password imported.")
    return res.status(200).json({
      "commands": [
        {
          "type": "com.okta.action.update",
            "value": {
            "credential": "VERIFIED"
          }
        }
      ]
    })
    ;
  }
  console.log("Not verified. Password not imported.")
  return res.status(204).send();
  
});


//***************************