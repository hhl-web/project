<template>
  <div id="app">
    <Login v-if="isShowLogin"></Login>
    <div class="main" v-else>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Login from '@/pages/login/index.vue';
import {mapState} from 'vuex';
export default {
  name: 'app',
	data(){
		return {
		
		}
	},
	components: {Login},
	computed:{
		...mapState(['username']),
		isShowLogin(){
			if(Object.keys(this.username).length!==0){
				return false
			}else{
				return true;
			}
		}
	},

}
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  .main{
	width: 100%;
  	height: 100%;
  }
}
</style>
