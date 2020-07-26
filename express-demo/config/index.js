//该文件用来配置项目环境变量
let obj=Object.create(null);
if (process.env.NODE_ENV='development'){
	obj.baseUrl="http://localhost:3000";
} else if(process.env.NODE_ENV = 'test') {
	console.log('当前是测试环境')
}else if(process.env.NODE_ENV='production'){
	console.log('当前是生产环境');
}
module.exports=obj;