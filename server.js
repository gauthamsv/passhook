//https
//const https = require('https');
//const fs = require('fs');

//const options = {
  //key: fs.readFileSync('key.pem'),
  //cert: fs.readFileSync('cert.pem')
//};
// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
/*const express = require("express");
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
  
}); */


//***************************

// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require('body-parser');
const fs = require("fs");
const sha512 = require('js-sha512');
const app = express();

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// if ./.data/sqlite.db does not exist, create table and insert two rows of data
// Store password for first row in plain text, password for second row hashed with SHA-512
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, password VARCHAR)"
    );
    console.log("New table users created!");
    db.serialize(() => {
      db.run(
        'INSERT INTO Users (userName, password) VALUES ("tinatest@doesnotexist.com", "textPassword"), ("timtest@doesnotexist.com",  "' + sha512('hashedPassword') + '")'
      );
    });
  }
});

// Determines if password needs to be hashed prior to comparing
// This example uses SHA-512 (already imported), but can be modified to include more or alternate hashes
// If true, the password typed in by the user will be hashed before comparison
// If false, the plain text password will be used for comparison
var hashed = true;



// PasswordImport request, Endpoint should match endpoint in Inline Hook
// For example: https://inline-hook-test.glitch.me/passwordImport
// Attempt to verify user password and return result to Okta
app.post("/passwordImport", async (request, response) => {
  console.log(" "); // for separation of logs during testing
  var verify = await comparePassword(request.body.data.context.credential);
  console.log('Password for ' + request.body.data.context.credential['username'] + ": " + verify);
  var returnValue = { "commands":[
                          { "type":"com.okta.action.update",
                            "value":{ "credential": verify } }
                    ]}
  response.send(JSON.stringify(returnValue));
})

// If database password stored as hash, call hashpassword() to convert typed in password
// Compare typed in password to database password and return result 
async function comparePassword(creds) {
  var pwd = "";
  if (Boolean(hashed)) {
    pwd = await hashPassword(creds['password']);
    console.log('Text Password: ' + creds['password']);
    console.log('Hashed Password: ' + pwd);
  } else {
    pwd = creds['password'];
    console.log('Text Password: ' + creds['password']);
  }
  var db_password = await getDbPwd(creds['username'].toLowerCase());
  console.log('Database Password: ' + db_password);
  if (pwd === db_password) {
    return('VERIFIED');
  } else {
    return('UNVERIFIED');
  }
}

// Function to convert password to hashed password for comparison
// Can be modified for alternate hash functions or to add salt if needed
function hashPassword(pwd) {
  return sha512(pwd);
}


// Retreive and return password from database 
function getDbPwd(user) {
  return new Promise(resolve => {
      var sql = "SELECT password FROM Users WHERE userName = ?"
      db.get(sql, user, (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        return row
         ? resolve(row.password)
         : console.log(user + "not found in database")
      })
  });
}

// Upon request, return all users in database
app.get("/getUsers", async (request, response) => {
  let promise = new Promise((res, rej) => {
      db.all("SELECT * from Users", (err, rows) => {
        res(rows);
      })
  });
  
  var users = await promise;
  response.send(JSON.stringify(users));
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


// listen for requests :)
const listener = app.listen(process.env.PORT || 3000 , () => {
  console.log("Your app is listening on port " + listener.address().port);
});
