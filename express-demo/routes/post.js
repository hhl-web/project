var express = require('express');
var router = express.Router();
var path = require('path');
var multiparty = require('multiparty');
router.get('/',(req,res,next)=>{
	res.send({ 
      status:"200",
      msg:"成功！",
      img:'http://localhost:3000/images/home1.png'
  });
})
//上传个人头像图片
// router.get('/', function(req, res, next) {
// 	console.log(req.query)
//   let form = new multiparty.Form();
//   form.uploadDir=path.resolve(__dirname,'../public/images');
//   console.log(form.uploadDir);
//   form.keepExtensions=true;   //是否保留后缀
//   form.autoFiels=true;       //启用文件事件，并禁用部分文件事件，如果监听文件事件，则默认为true。
//   form.parse(req,function(err,fields,files){  //其中fields表示你提交的表单数据对象，files表示你提交的文件对象
// 	console.log(req.query,files)
//     if(err){
// 			console.log(err)
//       res.json({
//         status:"1",
//         msg:"上传失败！"+err
//       });
//     }else{
//       res.json({ 
//         status:"0",
//         msg:"上传成功！",
//         personPicture: "http://localhost:3000"+files.file[0].path.split("public")[1]
//       });
//     }
//   });  
// });
module.exports=router;