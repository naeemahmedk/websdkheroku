var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { getMeetingPasscode, generateSignature } = require("./helper");
const cors = require("cors");

var port = 80;

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(bodyParser.json());
app
    .listen(process.env.PORT || port);

app.post('/signature', async (req, res) => {
    if (req.body.meetingNumber && req.body.role) {
        res.status(200).json({"apiKey":process.env.API_KEY, "signature": generateSignature(process.env.API_KEY, process.env.API_SECRET, req.body.meetingNumber, req.body.role) });
        return;
    }

    res.json({ "response": "Invalid request" })
});

app.post('/passcode', async (req, res) => {
    if (req.body.meetingNumber) {
       let getPasscode=new Promise((resolve,reject)=>{
           resolve(getMeetingPasscode(req.body.meetingNumber));
       })
       .then(pass=>{
           return pass;
       });

       getPasscode.then(password=>{
           res.send({ "passcode": password });
       });
    }
});
