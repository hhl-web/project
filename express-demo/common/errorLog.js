const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const path = require('path');
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}-${level}- ${message}`;
});
const option={
	file:{
		level:'error',
		filename: path.join(__dirname, '../log/error.log'),
		handleExceptions:true,
		json:true,
		maxsize:5242880,
		maxFiles:5,
		colorize:true,
	},
	console:{
		level:'debug',
		handleExceptions:true,
		json:false,
		colorize:true,
	}
}
const logger=createLogger({
	format: combine(
		timestamp(),
		myFormat
	),
	transports:[
		new transports.File(option.file),
		new transports.Console(option.console),
	],
	exitOnError:false,
});
logger.stream={
	write:function(message,encoding){
		logger.error(message)
	}
}
module.exports=logger;