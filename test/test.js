#! /usr/bin/env node
var assert = require('assert'),
    GSV = require('../lib/gsv.js');

GSV.config('dist', '/tmp');

GSV.on('location', function(panoid, loc) {
  // console.log(panoid, JSON.stringify(loc));
  if(panoid == loc.panoId) // meaningless, show the panoid should equal loc.panoId
    console.log(GSV.tile(panoid, 1, 1));
});

GSV.on('link', function(p, link) {
  console.log(p, link);
});

console.log(GSV.streetView('56.960654,-2.201815'));
console.log(GSV.streetView('46G_Gu7RUil_aPxTLuEDgQ'));
