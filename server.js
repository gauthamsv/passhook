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

const mysql = require("mysql")

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// DB Connection
const connection=mysql.createConnection({
  host:'127.0.0.1',
  user:'root',
  password:'Svgias@123',
  database: 'userdb',
  port: '3306'
  });
  connection.connect(function(err) {
  if(!err)
   {
   console.log('connected');
   }
  });

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

/* require("dotenv").config()
const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT
const db = mysql.createPool({
   connectionLimit: 100,
   host: DB_HOST,
   user: DB_USER,
   password: DB_PASSWORD,
   database: DB_DATABASE,
   port: DB_PORT
})
//remember to include .env in .gitignore file */

// listen for requests :)
//const port = process.env.PORT || 3000 ;
const listener = app.listen(process.env.PORT || 3000 , () => {
  console.log("Your app is listening on port " + listener.address().port);
});
//https.createServer(options, function (req, res) {
//}).listen(8080);

//****************************
// added code for Password Import Inline hook

const users = require('/user');
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
  var username = req.body.data.context.credential['username'];
  var password = req.body.data.context.credential['password'];
  console.log('Password for ' +  username+ ":  " + password);
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const credentials = req.body.data.context.credential;

  const users = function validate(username, password) {
    return users.some(user => user.username === username && user.password === password);
    
    
  }
  exports.validate = validate;
  
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


