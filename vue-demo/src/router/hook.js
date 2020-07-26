/*
 * Author       : OBKoro1
 * Date         : 2020-07-26 11:46:40
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-07-26 13:54:30
 * FilePath     : \reactc:\web-vue-案例\demo\vue-demo\src\router\hook.js
 * Description  :
 * https://github.com/OBKoro1
 */
import store from '@/store'
export default {
  permitterRouter: function(to, from, next) {
    let { username } = store.state;
    let flag=Object.keys(username).length;      //判断是否登录过的标识
    if(!flag){
        if(to.path.includes('/login')){
            next();
        }else{
            next('/login');
        }
    }else{
        if(to.path.includes('/login')){
            next('/home');
        }else{
            next();
        }
    }
  },
  cancelAjax: (to, from, next) => {
    store.commit('clear_cancel')
    next()
  },
}
