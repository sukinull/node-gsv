var assert = require('assert'),
    GSV = require('../lib/gsv.js');

GSV.on('location', function(p, loc) {
  console.log(p, JSON.stringify(loc));
});

GSV.on('link', function(p, link) {
  console.log(p, link);
});

console.log(GSV.streetView('56.960654,-2.201815'));
console.log(GSV.streetView('46G_Gu7RUil_aPxTLuEDgQ'));
