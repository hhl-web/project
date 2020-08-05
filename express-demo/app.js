let createError = require('http-errors');	//用来创建http请求错误的模块
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');	//客户端中间件
let session = require("express-session");		
let bodyParser = require('body-parser');
let logger = require('morgan');
let winston=require('./common/errorLog.js');
let cors=require('cors');
let fs=require('fs');
let corsRequest=require('./common/corsRequest.js');
let loginFilter=require('./common/loginFilter.js');
let user=require('./routes/user');
let uploadHandleRouter = require('./routes/uploadHandle.js');


let app = express();
// 输出日志到目录
let accessLogStream = fs.createWriteStream(path.join(__dirname, './log/request.log'), { flags: 'a', encoding: 'utf8' }); 
app.use(logger('combined', { stream: accessLogStream }));
//跨域配置
corsRequest(app);
//静态托管，在搭建大前端时将页面放置public文件夹
app.use(express.static(path.join(__dirname, 'public')));
//种session存cookie配置
app.use(cookieParser('123456'));
app.use(session({
		secret: '123456',
    resave: false,
    saveUninitialized: true
}));
//登录拦截器
loginFilter(app);

//安装中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
//路由配置
app.use('/api/user',user);
app.use('/api/uploadHandle', uploadHandleRouter);
// app.use('/api/user/img',postRouter);

//用来捕获错误处理函数
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} -${req.method} - ${req.ip}`)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(cors({
	"origin":['http://localhost:8080','http://localhost:8081'],
	"credential":true,
	"methods":"DELETE,PUT,POST,GET,OPTIONS"
}));


module.exports = app;