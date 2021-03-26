
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const fetch = require("node-fetch");

function createJWTToken() {
  const payload = {
    iss: process.env.API_KEY,
    exp: ((new Date()).getTime() + 3600)
  };

  return jwt.sign(payload, process.env.API_SECRET);
}

function generateSignature(apiKey, apiSecret, meetingNumber, role) {

  const timestamp = new Date().getTime() - 30000
  const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
  const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
  const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

  return signature
}

function getMeetingPasscode(meetingNumber) {
  return fetch('https://api.zoom.us/v2/webinars/' + meetingNumber, {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + createJWTToken(),
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(meeting => {
      console.log(meeting)
      return meeting.password
    })
    .catch(error => {
      return error;
    });
}

module.exports = { getMeetingPasscode, generateSignature };