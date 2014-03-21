# Google Street View(GSV)
A geek way to access the Google StreetView Data from Node.js

## Installation
Under developing

## Design
We(In fact, I) focus on two information, pano's {location, links} dataset.

GSV may get location and links data by passing in latlng or Google internal panoid.
Each location and links(emit event, one link by link) will bind to panoid

## Usage

```
GSV = require('gsv');

GSV.on('location', function(panoid, loc) {
  console.log(panoid, JSON.stringify(loc));
});

GSV.on('link', function(panoid, link) {
  console.log(panoid, link);
});

GSV.streetView('25.033729,121.563867');
// or
GSV.streetView('dINsCMZgX--TpEMbNRNb9A');
```

## License
[AGPL](https://www.gnu.org/licenses/agpl.txt) or Contact me.

## Changelog list

* 0.0.1
	+ Initial version
	+ My first node module try
