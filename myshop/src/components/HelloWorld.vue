<template lang="pug">
div
  a(href="#" @click.prevent="signout") 登出
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
    methods: {
      signout(){
        const api = `${process.env.APIPATH}/logout`;
        const vm =this;
            //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
        this.$http.post(api).then((response) => {
        if (response.data.success){
            vm.$router.push('/login'); //控制router 跳轉頁面
        }
})


      }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
