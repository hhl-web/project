function loginFilter(app){
		app.use(function (req,res,next){
			if(!(req.session.auth_username && req.session.auth_password)){
				if(req.signedCookies.username && req.signedCookies.password){
					let {username,password}=req.signedCookies;
					req.session.auth_username=username;
					req.session.auth_password=password;			//将cookie的值存在session里
					next();
				}else{
					let arr=req.url.split('/');
					let index=arr && arr.findIndex((item)=>{
						return (item.indexOf('login')!=-1 || item.indexOf('relogin')!=-1);
					});
					if(index!==-1){
						next();
					}else{
						return res.status(200).json({
								code:401,
								msg: '没有登入，请先登入'
						 })
					}
				}
			}else{
				next();
			}
	})
}
module.exports=loginFilter;