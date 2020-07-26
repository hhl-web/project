import Router from 'vue-router';
import Vue from 'vue';
import hookRouter from './hook';
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router);
let router= new Router({
	mode:'hash',
	routes:[
		{
			path:'/',
			redirect:'/login',
			component:()=>import('@/pages/login/index.vue'),
		},
		{
			path:'/home',
			component:()=>import('@/pages/home/index.vue'),
		}
	]
})
//路由前置守卫
Object.values(hookRouter).forEach(hook=>{
	//使用bind可在hook函数获取this=>router
	router.beforeEach(hook.bind(router))
})
export default router;
