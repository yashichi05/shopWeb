<template lang="pug">
div
  form.form-signin( @submit.prevent="login")
    img.mb-4(src='' alt='' width='72' height='72')
    h1.h3.mb-3.font-weight-normal 管理者登入
    label.sr-only(for='inputEmail') 輸入電子信箱
    input#inputEmail.form-control(v-model="user.mail" type='email' placeholder='電子信箱' required='' autofocus='')
    label.sr-only(for='inputPassword') Password
    input#inputPassword.form-control(v-model="user.pwd"  type='password' placeholder='密碼' required='')
    .checkbox.mb-3
        label
        input(type='checkbox' value='remember-me')
        |  記得我
    button.btn.btn-lg.btn-primary.btn-block(type='submit') 登入
    

</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      user: {
          mail: '',
          pwd: ''
      }
    };
  },
  methods:{
      login(){
        const api = `${process.env.APIPATH}/admin/signin`;
        const vm =this;
            //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
        this.$http.post(api,{username:vm.user.mail,password:vm.user.pwd}).then((response) => {
        if (response.data.success){
            vm.$router.push('/admin/product'); //控制router 跳轉頁面
        }
})

      },


  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
.bd-placeholder-img
  font-size: 1.125rem
  text-anchor: middle

@media (min-width: 768px)
  .bd-placeholder-img-lg
    font-size: 3.5rem

html,body 
	height: 100% 
body 
	display: -ms-flexbox 
	display: flex 
	-ms-flex-align: center 
	align-items: center 
	padding-top: 40px 
	padding-bottom: 40px 
	background-color: #f5f5f5 
.form-signin 
	width: 100% 
	max-width: 330px 
	padding: 15px 
	margin: auto 
	.checkbox 
		font-weight: 400 
	.form-control 
		position: relative 
		box-sizing: border-box 
		height: auto 
		padding: 10px 
		font-size: 16px 
		&:focus 
			z-index: 2 
	input[type="email"] 
		margin-bottom: -1px 
		border-bottom-right-radius: 0 
		border-bottom-left-radius: 0 
	input[type="password"] 
		margin-bottom: 10px 
		border-top-left-radius: 0 
		border-top-right-radius: 0 

</style>
