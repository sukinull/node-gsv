var qs = require('querystring'),
    request = require('request'),
    crypto = require('crypto'),
    url = require('url'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    config;

var _config = {
  'google-client-id': null,
  'stagger-time': 200,
  'encode-polylines': true,
  'proxy': null,
  set 'google-private-key'(privateKey) {
    if (privateKey){
      // Google private keys are URL friendly base64, needs to be replaced with base64 valid characters
      this.googlePrivateKey = privateKey.replace(/-/g,'+').replace(/_/g,'/');
      this.googlePrivateKey = new Buffer(this.googlePrivateKey, 'base64');
    } else {
      this.googlePrivateKey = null;
    }
  },
  get 'google-private-key'() {
    return this.googlePrivateKey || null;
  }
};

var GSV = new EventEmitter();

GSV.onData = function(err, data) {
  if(err) {
    return;
  }

  data = JSON.parse(data);
  if(data.Location) {
    panoid = data.Location.panoId;
    GSV.emit('location', panoid, data.Location);
    if(data.Links) {
      data.Links.forEach(function (e) {
      GSV.emit('link', panoid,  e);
    });
  }
   
  if(data.Data) {}
    if(data.Projection) {}
  }
};

GSV.config = config = function(key, value) {
  if (arguments.length === 1) {
    if (typeof key === 'object' && key !== null) {
      var settings = key;
      for (var key in settings) {
        config(key, settings[key]);
      }
    } else {
      return _config[key];
    }
  } else {
    _config[key] = value;
  }
};

// http://wherecamp.pbworks.com/w/page/10229277/Hacking%20Google%20Street%20View
// gmapcatcher
// ?output={xml,xml}&ll={latlng}&panoid={panoid}
GSV.streetView = function(loc, callback) {
  var args = {
    'output': 'json',
  };
  if (loc.indexOf(',') > 0) {
    args.ll = loc;
  } else {
    args.panoid = loc;
  }

  var url = 'cbk'+Math.floor(Math.random()*4)+".google.com/cbk";
  if(typeof(callback)=='undefined')
    callback = GSV.onData;

  return makeRequest(url, args, false, callback);
};

// http://cbk0.google.com/cbk?output=tile&panoid=dFe0IGjaC3rLQGHUTChJDQ&zoom=3&x=5&y=2
GSV.tile = function(panoid, x, y, zoom) {
  //TODO: 
};

// http://cbk[0-3].google.com/cbk
// Makes the request to Google Maps API.
// If secure is true, uses https. Otherwise http is used.
var makeRequest = function(url, args, secure, callback) {
  var maxlen = 2048;

  var path = url + "?" + qs.stringify(args);
  if (path.length > maxlen) {
    throw new Error("Request too long for google to handle (2048 characters).");
  }

  var options = {
    uri: (secure ? 'https' : 'http') + '://' + path
  };

  if (GSV.config('proxy')) options.proxy = GSV.config('proxy');

  if (typeof callback === 'function') {
    request(options, function (error, res, data) {
      if (error) {
        return callback(error);
      }
      if (res.statusCode === 200) {
        return callback(null, data);
      }
      return callback(new Error("Response status code: " + res.statusCode), data);
    });
  }

  return options.uri;
};

module.exports = GSV;
