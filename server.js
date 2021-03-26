var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { getMeetingPasscode, generateSignature } = require("./helper");
const cors = require("cors");

var port = 9000;

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
        res.status(200).json({ "signature": generateSignature(process.env.API_KEY, process.env.API_SECRET, req.body.meetingNumber, req.body.role) });
        return;
    }

    res.json({ "response": "Invalid request" })
});

app.post('/passcode', async (req, res) => {
    if (req.body.meetingNumber) {
        res.status(200).json({ "signature": getMeetingPasscode(req.body.meetingNumber) });
        return;
    }

    res.json({ "response": "Invalid request" })
});