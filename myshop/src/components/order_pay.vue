<template lang="pug">
div
    loading(:active.sync="isLoading")
    h1.text-center.m-5 購買清單
    .my-5.row.justify-content-center 
        form.col-md-6
            table.table
                thead
                    tr
                        th 品名
                        th 數量
                        th 單價
                tbody
                    tr(v-for='item in order_info.products', :key='item.id')
                        td.align-middle {{ item.product.title }}
                        td.align-middle {{ item.qty }}/{{ item.product.unit }}
                        td.align-middle.text-right {{ item.final_total }}
                tfoot
                    tr
                        td.text-right(colspan='2') 總計
                        td.text-right {{ order_info.total }}
            table.table
                tbody
                    tr
                        th(width='100') Email
                        td {{ order_info.user.email }}
                    tr
                        th 姓名
                        td {{ order_info.user.name }}
                    tr
                        th 收件人電話
                        td {{ order_info.user.tel }}
                    tr
                        th 收件人地址
                        td {{ order_info.user.address }}
                    tr
                        th 付款狀態
                        td
                            span(v-if='!order_info.is_paid') 尚未付款
                            span.text-success(v-else='') 付款完成
            .d-flex.justify-content-between
                div.d-flex
                    .text-right(v-if='order_info.is_paid === false')
                        button.btn.btn-danger.mr-2(@click.prevent='credit_pay_submit("Credit")') 信用卡付款
                    .text-right(v-if='order_info.is_paid === false')
                        button.btn.btn-success.mr-2(@click.prevent='credit_pay_submit("CVS")') 超商付款
                    .text-right(v-if='order_info.is_paid === false')
                        button.btn.btn-info(@click.prevent='credit_pay_submit("WebATM")') 網路ATM付款
                    .text-right(v-if='order_info.is_paid === true')
                        button.btn.btn-primary(@click="closeW") 關閉視窗
                div
                    .text-right(v-if='order_info.is_paid === false')
                        button.btn.btn-primary.mr-2(@click.prevent='credit_pay_submit("ALL")') 前往付款頁面

                        
    credit_pay(v-if="order_info_finish" :ReturnURL="paidURL" :MerchantTradeNo="ordeidCovert",:MerchantTradeDate="dateConvert",:TotalAmount="order_info.total",:TradeDesc="desc",:ItemName="item_name",:ClientBackURL="backURL")


</template>

<script>
import credit_pay from "./page/credit_pay";
import $ from "jquery";
export default {
  data() {
    return {
      isLoading: false,
      order_info_finish: false,
      order_info: {
        user: {
          name: "",
          tel: "",
          address: ""
        }
      }
    };
  },
  computed: {
    paidURL() {
      let vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/pay/${vm.$route.query.id}`;

      return api
    },
    item_name() {
      let vm = this;
      if (!vm.order_info.products) {
        return "";
      }
      return vm.itemCovert(vm.order_info.products);
    },
    backURL() {
      let vm = this;
      return `https://yashichi05.github.io/vue/#${vm.$route.fullPath}`;
    },
    desc() {
      //op訂單描述
      let vm = this;
      return `${vm.order_info.user.name}:${vm.order_info.id}`;
    },
    dateConvert() {
      //日期轉換
      let input = this.order_info.create_at;
      if (!input) {
        return "";
      }
      let newDate = new Date();
      newDate.setTime(input * 1000);
      let year = newDate.getFullYear();
      // Minutes part from the timestamp
      let month = "0" + (newDate.getMonth() + 1);
      // Seconds part from the timestamp
      let day = "0" + newDate.getDate();
      let hour = "0" + newDate.getHours();
      let mini = "0" + newDate.getMinutes();
      let sec = "0" + newDate.getSeconds();
      return `${year}/${month.substr(-2)}/${day.substr(-2)} ${hour.substr(
        -2
      )}:${mini.substr(-2)}:${sec.substr(-2)}`;

      // return "2019/10/26 17:34:04";
    },
    ordeidCovert() {
      //訂單id 轉 opay訂單id
      let random = ("0000" + Math.floor(Math.random() * 9999)).substr(-4);
      try {
        return this.order_info.id.replace(/[^a-zA-Z0-9]/g, "") + random; //訂單ID去掉特殊字符後隨機加4碼，可以多次產生新用可訂單(產生後關掉回不去))
      } catch (e) {
        console.log("orderidnotfound");
        return "";
      }
    },

    timestamp() {
      //取得現在時間戳記
      // return '1572104277'
      return Math.floor(Date.now() / 1000);
    }
  },
  methods: {
    closeW() {
      //關閉視窗
      window.opener = null;
      window.close();
    },
    credit_pay_submit(how) {
      //信用卡付款葉面
      // console.log("asdasd");
      const vm = this;
      // vm.$router.push({
      //   path: "/credit",
      //   query: {
      //     MerchantTradeNo: vm.ordeidCovert,
      //     MerchantTradeDate: vm.dateConvert,
      //     TotalAmount: vm.order_info.total,
      //     ItemName: vm.itemCovert(vm.order_info.products),
      //     TradeDesc: `${vm.order_info.user.name}使用信用卡付款:${vm.order_info.id}`,
      //     ClientBackURL: `http://localhost:8080/#${vm.$route.fullPath}`
      //   }
      // });
      this.$bus.$emit("credit_pay_submit", how);
    },
    itemCovert(prds) {
      //商品轉換
      let text = "";
      // console.log(prds)
      for (let [key, value] of Object.entries(prds)) {
        text += `${value.product.title}  ${value.qty}/${value.product.unit}#`;
      }
      return text;
    },
    paid() {
      //設為已付款
      //沒輸入，預設1
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/pay/${vm.$route.query.id}`;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.post(api).then(response => {
        console.log(api);
        vm.getorder();
        vm.isLoading = false;
      });
    },
    getorder() {
      //取得訂單
      //沒輸入，預設1
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/order/${vm.$route.query.id}`;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        // console.log(response.data);
        vm.order_info = response.data.order;
        vm.order_info_finish = true;
        vm.isLoading = false;
      });
    }
  },
  components: {
    credit_pay
  },
  mounted() {
    // this.getpaid()
  },
  created() {
    let vm = this;
    vm.getorder();
  }
};
</script>