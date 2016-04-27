// Copyright 2015-2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
'use strict';


var express = require('express');
var app = express();
var port = 8080;
//var request = require('request');
var https = require('https');
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.status(200).send('Hello, world!');
});

app.get('/webhook/', function (req, res) {
  console.log("In the get");
  if (req.query['hub.verify_token'] === 'mobileFeatureQE') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})


app.post('/webhook/', function (req, res) {
  console.log("In the Post Webhook");
  var obj = JSON.stringify(req.body);
  console.log(obj);
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
        sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

var token = "CAAT6h9nizVIBAK7iZBu50D8KDUev4rlgEYOk8mQTXcDL0ZBPndZBTWslhs2lojTX3Frwtt9k1ZB01MbZB6GCl4DYZBQbaceDfMb3PY1loXN6ZBskZASi6LZCjZBSTwCIOIGNbuRywwmkjBu1PNgDRW8ObIXnmPVAsm8CTvcBGqZABxhe60AKOzAEx9XSiaZABO8ZBnwA3gIpo5l1r5wZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
// Start the server
var server = app.listen(process.env.PORT || '8080', '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address,
    server.address().port);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
