var debug = require('debug')('tkey');
var timestamp = require('time-stamp');

module.exports = TKey;

function TKey(format, step)
{
	if (!(this instanceof TKey))
	{
		return new TKey(format, step);
	}

	this.format = format;
	this.step = step || 1;
	this.ttl = 0;
	this.result = null;
}

var proto = TKey.prototype;
proto.toString
	= proto.toJSON
	= proto.one
	= function one()
	{
		var now = new Date;
		if (!this.ttl || this.ttl < now)
		{
			var mynow = new MyDate(now, this.step);
			if (typeof this.format == 'string')
			{
				this.result = timestamp(this.format, mynow);
			}
			else
			{
				this.result = this.format(mynow);
			}

			this.ttl = +mynow.ttl();
			debug('result:%s, ttl:%s', this.result, this.ttl);
		}

		return this.result;
	};

function MyDate(date, step)
{
	this.date = date;
	this.step = step || 1;
	this.index = 0;
	this.handlerType = 0;
}

var proto = MyDate.prototype;
proto.ttl = function()
{
	var getArr = getDateHanlderNames[this.handlerType];
	var setArr = setDateHanlderNames[this.handlerType];
	var getHandler = getArr[this.index];
	var setHandler = setArr[this.index];

	var now = new Date;
	now[setHandler](now[getHandler]() + this.step);
	debug('setHandler:%s getHandler:%s', setHandler, getHandler);

	for(var i = this.index+1, len = setArr.length; i < len; i++)
	{
		setHandler = setArr[i];
		debug('setHandler:%s', setHandler);
		now[setHandler](0);
	}

	debug('ttl:%s', now);
	return now;
}

var DateHanlderNames =
[
	'getFullYear', 'getMonth', 'getDay', 'getDate',
	'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds'
];
var getDateHanlderNames = [[], []];
var setDateHanlderNames = [[], []];

DateHanlderNames.forEach(function(name, index)
{
	var keyname = name.substr(3);
	[name, 'getUTC'+keyname].forEach(function(handlerName, handlerType)
	{
		var handler = Date.prototype[handlerName];
		getDateHanlderNames[handlerType].push(handlerName);
		proto[handlerName] = function()
		{
			if (index > this.index)
			{
				this.index = index;
				this.handlerType = handlerType;
			}

			return handler.apply(this.date, arguments);
		};
	});

	['set'+keyname, 'setUTC'+keyname].forEach(function(handlerName, handlerType)
	{
		var handler = Date.prototype[handlerName];
		setDateHanlderNames[handlerType].push(handlerName);
		proto[handlerName] = function()
		{
			return handler.apply(this.date, arguments);
		};
	});
});
