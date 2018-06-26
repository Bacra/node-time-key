var expect = require('expect.js');
var TKey = require('../');
var timestamp = require('time-stamp');

describe('#base', function()
{
	it('#base', function()
	{
		var format = 'YYYY/MM/DD HH';
		var now = new Date;
		var key1 = TKey(format);
		expect(key1.one()).to.be(timestamp(format, now));
		now.setHours(now.getHours()+1);
		expect(key1.ttl).to.be(+new Date(timestamp(format, now)+':00:00:00'));
	});
});
