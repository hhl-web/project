<template>
  <div class="home">
    <el-container style="min-height:100%">
      <el-header>
        你好，{{username.username}}用户~欢迎来到home的主页
        <el-button @click="unreset('ruleForm')" id="unlogin">注销</el-button>
      </el-header>
      <el-main>
            <UploadFile></UploadFile>
      </el-main>
      <el-footer>footer</el-footer>
    </el-container>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import {unLogin} from '@/api';
  import UploadFile from '../upload/index'
	export default{
    name:'loginPage',
    computed:{
      ...mapState(['username']),
    },
    components:{UploadFile},
    methods:{
      unreset(){
				unLogin().then(res=>{
          if(res.code==200){
            this.$store.commit('clear_username');
            location.reload();
          }
				}).catch(err=>{
					console.log(err);
				})
			}
    }
  }
</script>

<style lang="scss" scoped>
 .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: chocolate;
    text-align: center;
    line-height: 200px;
    font-size: 20px;
  }
  .home{
    height: 100%;
    width: 100%;
    #unlogin{
      float: right;
      margin: 10px 0;
    }
  }
</style>
