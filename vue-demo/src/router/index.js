import Router from 'vue-router';
import Vue from 'vue';
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router);
export default new Router({
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