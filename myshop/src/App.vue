<template lang="pug">
  #app
    // <HelloWorld/>
    router-view
</template>

<script>

export default {
  name: 'App',
//   created(){
//     const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/products`;
//     //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
//     this.$http.get(api).then((response) => {
//   // console.log(response.data);
// })
//   }
}
</script>

<style lang="sass">
@import "./assets/all"
</style>
