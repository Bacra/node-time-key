var debug = require('debug')('time-key');
var timestamp = require('time-stamp');

module.exports = TimeKey;

/**
 * 时间结果缓存
 *
 * @param       {String/Function} format 日期格式化
 * @param       {Number/Function} step   ttl计算时，需要追加的区间 / onupdate handler
 * @constructor
 */
function TimeKey(format, step)
{
	if (!(this instanceof TimeKey))
	{
		return new TimeKey(format, step);
	}

	if (typeof step == 'function')
	{
		this.onupdate = step;
		step = null;
	}

	// 日期格式化
	this.format = format;
	// 过期后追加的进度
	this.step = step || 1;
	// 下次刷新结果时间
	this.ttl = 0;
	// 暂存结果
	this.result = null;
}

var proto = TimeKey.prototype;
proto.toString
	= proto.toJSON
	= proto.key
	= function key(now)
	{
		if (!now || !now.getFullYear) now = new Date;

		if (!this.ttl || this.ttl < now)
		{
			var mynow = new MyDate(now, this.step);

			if (typeof this.format == 'string')
				this.result = timestamp(this.format, mynow);
			else
				this.result = this.format(mynow);

			this.ttl = +mynow.ttl();
			this.onupdate(now);
			debug('update result:%s, ttl:%s', this.result, this.ttl);
		}

		return this.result;
	};

proto.onupdate = function(){};


/**
 * 模拟Date对象
 *
 * @param       {Date}   date 时间
 * @param       {Number} step ttl计算时，需要追加的区间
 * @constructor
 */
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
