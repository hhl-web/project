/*
 * Author       : OBKoro1
 * Date         : 2020-07-22 21:54:25
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-07-23 23:02:06
 * FilePath     : \reactc:\web-vue-案例\demo\express-demo\routes\user.js
 * Description  : 
 * https://github.com/OBKoro1
 */ 
const express=require('express');
const user = express.Router();
let db = require('../sql/db.js');
//登录
user.get('/login',function(req,res,next){
	let name, password, data;
	if (Object.keys(req.query).length == 2) {
		name = req.query.name; //用户名
		password = req.query.password; //用户密码
		db({
			database: 'hhlmysql'
		}, "SELECT username,password FROM user WHERE username='" + name + "' AND password='" + password + "'", function(
			err, result, fields) {
			data = JSON.stringify(result);
			data = JSON.parse(data);
			if (!data.length) {
				 return res.send({
					code: 500,
					msg: "账号或密码错误，请重新填写！！"
				});
			} else {
				let bool=data.every(item=>item.username==name && item.password==password);
				if(bool){
					req.session.auth_username=name;
					req.session.auth_password=password;
					res.cookie('username',name, {maxAge:1000 * 60 * 60 * 24 * 7,signed:true});		//设置cookie的保存时间，7天为例
					res.cookie('password',password, {maxAge: 1000 * 60 * 60 * 24 * 7,signed:true});	//console.log(req.signedCookies);
					return res.send({
						code: 200,
						msg: "登录成功！！",
						data:{
							username:name,
							password:password,
						}
					});
				}
			}
		})
	} else {
		return res.send({
			code: 500,
			msg: "请将信息填写完整！！"
		});
	}
});
//注册
user.get('/relogin',function(req,res,next){
    let username, password, data
    if (Object.keys(req.query).length == 2) {
      username = req.query.name
      password = req.query.password
      db(
        {
          database: 'hhlmysql',
        },
        "SELECT username,password FROM user WHERE username='" +
            username +
          "' AND password='" +
          password +
          "'",
        function (err, result, fields) {
          data = JSON.stringify(result)
          data = JSON.parse(data)
          if (!data.length) {
            db(
              { database: 'hhlmysql' },
              "INSERT INTO user(username,password) VALUES ('" +
                username +
                "','" +
                password +
                "')",
              function (error,result, fields) {
                if (!error)
                  return res.send({ code: 200, msg: '注册成功，即可登录！！' })
              }
            )
          } else {
            return res.send({
              code: 500,
              msg: '该用户已存在，请重新注册信息！！',
            })
          }
        }
      )
    } else {
      return res.send({
        code: 500,
        msg: '请将信息填写完整！！',
      })
    }
});
//注销
user.get('/unreset',function(req,res,next){
	let user=req.session.auth_username;
	let pass=req.session.auth_password
	res.cookie('username',user, {maxAge:0,signed:true});		
	res.cookie('password',pass, {maxAge:0,signed:true});
	req.session.auth_password=undefined;
	req.session.auth_username=undefined;
	let {username,password}=req.signedCookies;
	return res.send({
		code:200,
		msg:'注销成功！！'
	});
})
module.exports=user;