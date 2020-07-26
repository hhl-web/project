<template>
  <div class="login">
    <div class="content">
      <el-form :model="ruleForm"
               status-icon
               :rules="rules"
               ref="ruleForm"
               label-width="80px"
               style="display: inline-block;">
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input type="password"
                    v-model="ruleForm.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {Login,Reset} from '@/api';
	export default{
		name:'loginPage',
		data(){
			var checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'));
        }
      };
      var checkUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('用户名不能为空！'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
			return {
				 ruleForm: {
          username: '',
          password: '',
        },
				rules: {
          username: [
            { validator: checkUsername, trigger: 'blur' }
          ],
          password: [
            { validator: checkPassword, trigger: 'blur' }
          ]
        }
      };
		},
		mounted(){
		},
		methods:{
			getImage(){
				this.$api.request({
					methods:'post',
					url:'/api/user/img',
				}).then(res=>{
					this.obj=res.data;
					console.log(res.data);
				}).catch(err=>{
					console.log(err)
				})
			},
			//登录
			submitForm(){
				Login({
					name:this.ruleForm.username,
					password:this.ruleForm.password,
				}).then(res=>{
          if(res.code==200){
            this.$store.commit('set_username',res.data);
            this.$router.push('/home');
          }
				}).catch(err=>{
					console.log(err)
				})
			},
			//注册
			resetForm(){
				Reset({
					name:this.ruleForm.username,
					password:this.ruleForm.password,
				}).then(res=>{
					if(res.code==200){
            this.$message({
              type:'success',
              message:'注册成功~'
            })
          }
				}).catch(err=>{
					console.log(err);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/login_bg.png");
  .content {
    width: 360px;
    height: 320px;
    position: absolute;
    right: 0;
    left: 0;
    top: 10%;
    margin: 0 auto;
    line-height: 400px;
    background: aliceblue;
    box-shadow: 10px 10px 5px #888888;
  }
}
</style>
