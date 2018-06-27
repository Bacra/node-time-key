var expect = require('expect.js');
var timekey = require('../');
var timestamp = require('time-stamp');
var Promise = require('bluebird');

describe('#base', function()
{
	it('#base', function()
	{
		var format = 'YYYY/MM/DD HH';
		var now = new Date;
		var key = timekey(format);
		expect(key.key()).to.be(timestamp(format, now));
		now.setHours(now.getHours()+1);
		expect(key.ttl).to.be(+new Date(timestamp(format, now)+':00:00:00'));
	});

	it('#step', function()
	{
		var format = 'YYYY/MM/DD HH';
		var now = new Date;
		var key = timekey(format, 2);
		expect(key.key()).to.be(timestamp(format, now));
		now.setHours(now.getHours()+2);
		expect(key.ttl).to.be(+new Date(timestamp(format, now)+':00:00:00'));
	});

	it('#onupdate', function()
	{
		var format = 'YYYY/MM/DD HH:mm:ss:ms';
		var hasUpdate = false;
		var key = timekey(format, function(){hasUpdate = true});

		return Promise.delay(100)
			.then(function()
			{
				key.key();
				expect(hasUpdate).to.be(true);
			});
	});
});
