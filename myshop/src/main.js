// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router'; //導入副元件
import 'bootstrap'
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules"; //從rules導入required (不能自訂名稱) ，並使用required 在此文件呼叫

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import './bus'; //載入bus
import c_filter from './filters/currency'; //載入currency
import stamp from './filters/stampToString'; //載入時間戳記 轉文字

axios.defaults.withCredentials = true; //????????????cookie?

Vue.component('Loading',Loading); //全域宣告使用
Vue.filter('c_filter',c_filter); //vue全局底下新增 filter 參考https://vuejs.org/v2/guide/filters.html
Vue.filter('stamp',stamp); //vue全局底下新增 filter 參考https://vuejs.org/v2/guide/filters.html
Vue.config.productionTip = false;
Vue.use(VueAxios,axios);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router: router
})
//vee-validate
extend("required", {...required,message:'{_field_} 必須填寫'}); //導入後 自訂訊息
extend("email", {...email,message:'信箱格式錯誤'});


router.beforeEach((to, from, next) => {

  //所果前往的原件meta內有想要的值
  if (to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
    axios.post(api).then((response) => { //執行ajax
    if(response.data.success){
      console.log(next)
      next(); //繼續前往
    }else{
      next({path:'/login'}) //轉向前往
    }
})
  }
  else{
    next()
  }

})