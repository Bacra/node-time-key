TKey
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![NPM License][license-image]][npm-url]


Time Key

# Install

```
npm install tkey --save
```


# Useage

```javascript
var TKey = require('tkey');
var timestamp = require('time-stamp');
var key = TKey('YYYYMMDDHH');
console.log(key.one());		// 2016061112
console.log(timestamp('YYYY/MM/DD HH:mm:ss:ms', new Date(key.ttl)));	// 2016/06/11 13:00:00:00
```


[npm-image]: http://img.shields.io/npm/v/tkey.svg
[downloads-image]: http://img.shields.io/npm/dm/tkey.svg
[npm-url]: https://www.npmjs.org/package/tkey
[travis-image]: http://img.shields.io/travis/Bacra/node-tkey/master.svg?label=linux
[travis-url]: https://travis-ci.org/Bacra/node-tkey
[coveralls-image]: https://img.shields.io/coveralls/Bacra/node-tkey.svg
[coveralls-url]: https://coveralls.io/github/Bacra/node-tkey
[license-image]: http://img.shields.io/npm/l/tkey.svg
