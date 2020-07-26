/*
 * Author       : OBKoro1
 * Date         : 2020-07-26 11:01:32
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-07-26 11:02:42
 * FilePath     : \reactc:\web-vue-案例\demo\express-demo\routes\upload.js
 * Description  : 
 * https://github.com/OBKoro1
 */ 
//处理单个上传图片
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');
var obj=require('../config/index');
router.post('/', function(req, res, next) {
	let form = new multiparty.Form();
	form.uploadDir = path.resolve(__dirname, "../public/images");
	// form.keepExtensions=true;   //是否保留后缀
	form.parse(req, function(err, fields, files) { //其中fields表示你提交的表单数据对象，files表示你提交的文件对象
		if (err) return res.json({
			status: 500,
			msg: "上传失败！" + err
		});
		let fileName = files.file[0].originalFilename;		//图片的起始名
		let filePath = files.file[0].path;								//存放图片路径
		let newfilePath = path.resolve(__dirname, `../public/images/${fileName}`);		//图片新的名称
		fs.rename(filePath, newfilePath, function(error) {
			if (error) return;
			return res.json({
				status: 200,
				msg: "上传成功！",
				data: obj.baseUrl+'/images/'+fileName
			});
		});
	})

});
module.exports = router