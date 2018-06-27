time-key
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![NPM License][license-image]][npm-url]


Time Key

# Install

```
npm install time-key --save
```


# Useage

```javascript
var timekey = require('time-key');
var timestamp = require('time-stamp');
var key = timekey('YYYYMMDDHH');
console.log(key.one());		// 2016061112
console.log(timestamp('YYYY/MM/DD HH:mm:ss:ms', new Date(key.ttl)));	// 2016/06/11 13:00:00:00
```


[npm-image]: http://img.shields.io/npm/v/time-key.svg
[downloads-image]: http://img.shields.io/npm/dm/time-key.svg
[npm-url]: https://www.npmjs.org/package/time-key
[travis-image]: http://img.shields.io/travis/Bacra/node-time-key/master.svg?label=linux
[travis-url]: https://travis-ci.org/Bacra/node-time-key
[coveralls-image]: https://img.shields.io/coveralls/Bacra/node-time-key.svg
[coveralls-url]: https://coveralls.io/github/Bacra/node-time-key
[license-image]: http://img.shields.io/npm/l/time-key.svg
