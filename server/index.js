'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();
var plugins = require('./config/plugins');
var routes = require('./config/routes');
var authenticate = require('./config/authenticate');
var mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URL);
server.connection({port:process.env.PORT});

mongoose.connection.once('open', function() {
  server.register(plugins, function() {
    server.auth.strategy('session', 'cookie', true, authenticate);
    server.route(routes);
    server.start(function() {
      require('./events/on-pre-response')(server);
      console.log('info', server.info.uri);
      console.log('info', process.env.MONGO_URL);
    });
  });
});
