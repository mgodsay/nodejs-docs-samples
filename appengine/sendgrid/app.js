// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START app]
'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// [START setup]
// The following environment variables are set by app.yaml when running on GAE,
// but will need to be manually set when running locally.
var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
var SENDGRID_SENDER = process.env.SENDGRID_SENDER;
var Sendgrid = require('sendgrid')(SENDGRID_API_KEY);
// [END setup]

var app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// [START index]
app.get('/', function(req, res) {
  res.render('index');
});
// [END index]

// [START hello]
app.post('/hello', function(req, res, next) {
  Sendgrid.send({
    from: SENDGRID_SENDER, // From address
    to: req.body.email, // To address
    subject: 'Hello World!', // Subject
    text: 'Sendgrid on Google App Engine with Node.js', // Content
  }, function (err) {
    if (err) {
      return next(err);
    }
    // Render the index route on success
    return res.render('index', {
      sent: true
    });
  });
});
// [END hello]

if (module === require.main) {
  // [START server]
  var server = app.listen(
    process.env.PORT || 8080,
    '0.0.0.0',
    function () {
      var address = server.address().address;
      var port = server.address().port;
      console.log('App listening at http://%s:%s', address, port);
      console.log('Press Ctrl+C to quit.');
    }
  );
  // [END server]
}

module.exports = app;
// [END app]
