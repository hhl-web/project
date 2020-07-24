/*
 * Author       : OBKoro1
 * Date         : 2020-07-23 21:22:34
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-07-23 21:23:14
 * FilePath     : \reactc:\web-vue-案例\demo\vue-demo\src\api\index.js
 * Description  : 
 * https://github.com/OBKoro1
 */ 
import ajaxFetch from './fetch.js';
export const Login=(option)=>ajaxFetch.request({
		methods:'get',
		url:'/api/user/login',
		params:{
			...option
		}
});

export const Reset=(option)=>ajaxFetch.request({
		methods:'post',
		url:'/api/user/relogin',
		params:{
			...option
		}
});

export const unLogin=(option)=>ajaxFetch.request({
		methods:'get',
		url:'/api/user/unreset'
})