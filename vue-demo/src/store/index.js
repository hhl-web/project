import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

let persits=(store)=>{
	let state;
	console.log(state)
	if(state=sessionStorage.getItem('vuex-state')) store.replaceState(JSON.parse(state));
	store.subscribe((mutations,state)=>{
		sessionStorage.setItem('vuex-state',JSON.stringify(state));
	})
}
import * as mutaionsType from './mutations-TYPE';
export default new Vuex.Store({
	plugins:[persits],
	state:{
		cancelArray:[],		//存放axios取消函数容器
		username:{},
	},
	mutations:{
		[mutaionsType.clear_cancel]:(state,payload)=>{
			state.cancelArray.forEach(fn=>{
				fn.call(fn);
			})
			state.cancelArray=[];
		},
		[mutaionsType.filter_cancel]:(state,payload)=>{
			let arr=state.cancelArray.filter(item=>!(item.url.includes(payload)));
			state.cancelArray=[...arr];
		},
		[mutaionsType.push_cancel]:(state,payload)=>{
			state.cancelArray.push(payload);
		},
		[mutaionsType.set_username]:(state,payload)=>{
			state.username=payload;
		},
		[mutaionsType.clear_username]:(state,payload)=>{
			state.username={};
			sessionStorage.setItem('vuex-state',{});
		}
	},
	actions:{},
	modules:{}
})
