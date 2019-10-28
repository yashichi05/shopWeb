<template lang="pug">
div
    loading(:active.sync="isLoading")
        // Modal
    #editOrder.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
        .modal-dialog(role='document')
            .modal-content.border-0
                .modal-header
                    h5#exampleModalLabel.modal-title
                        span 修改訂單
                    button.close(type='button', data-dismiss='modal', aria-label='Close')
                        span(aria-hidden='true') ×
                .modal-body
                    .card
                        .card-body
                            form(role="form")
                                h5.card-title 訂單編號: {{ordertemp.id}}
                                p.card-text 成立時間: {{ordertemp.create_at | stamp}}
                                hr
                                p.card-text 付款時間: {{ordertemp.paid_date | stamp}}
                                p.card-text 付款方式: {{ordertemp.payment_method}}
                                p.card-text.float-right 總金額: {{ordertemp.total | c_filter}}
                                p.card-text {{ordertemp.is_paid?'已付款':'未付款'}}
                                hr
                                .form-group
                                    label(for='name') 姓名
                                    input#name.form-control(v-model="ordertemp.user.name" type='text', placeholder='姓名')
                                
                                .form-group
                                    label(for='tel') 電話
                                    input#tel.form-control(v-model="ordertemp.user.tel" type='text', placeholder='電話')
                                
                                .form-group
                                    label(for='address') 住址
                                    input#address.form-control(v-model="ordertemp.user.address" type='text', placeholder='住址')
                                
                                .form-group
                                    label(for='num') 順序
                                    input#num.form-control(v-model="ordertemp.num" type='number', placeholder='順序')
                                .form-group
                                    label(for='msg') 訊息
                                    textarea#msg.form-control(v-model="ordertemp.message" type='text', placeholder='訂單訊息')
                                .rounded.border.border-primary.p-2
                                    .text-center 購買清單
                                    .pb-2(v-for="(thing,prd_index) in ordertemp.products" :key="prd_index") 
                                        hr 
                                        .d-flex.justify-content-between
                                          div {{thing.product.title}}
                                          div {{thing.qty}}/{{thing.product.unit}}
                                         
                                    
                                
                                
                            

            

                .modal-footer
                    button.btn.btn-primary(@click="editorder" type='button') 送出
                    button.btn.btn-secondary(type='button', data-dismiss='modal') 取消
                    
    

    table.table.mt-4
        thead
            tr 
                th 時間
            
                th 訂單編號
            
                th 付款
            
   
            
                th 付款日期
            
                th.text-center 付款方式
                th.text-center 顧客姓名
                th 總金額
                th.text-center(width="75") 修改
        tbody
            tr(v-for="(item,index) in orders" :key="item.id")
                td {{item.create_at | stamp}}
                td {{item.id}}
                td {{item.is_paid}}

                td {{item.paid_date| stamp}}
                td {{item.payment_method}}
                td {{item.user.name}}
                td.text-right {{item.total | c_filter}}
                td
                    button.btn.btn-outline-primary.btn-sm(@click="openModal(item)") 編輯

    pagination


</template>

<script>
import $ from "jquery";
import pagination from "./pagination";
export default {
  data() {
    return {
      prd_list:'',
      orders: [],
      ordertemp: {
        user:{
        name:'',
        tel:'',
        address:'',}
      },
      isLoading: false,
      status: {
        upfileLoading: false,
        prdLoading: false
      }
    };
  },
  methods: {
    getorder(page = 1) {
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        vm.orders = response.data.orders;
        this.$bus.$emit('getpage',response.data.pagination); //1. getprd時發送getpage 事件 並傳送response.data.pagination資料
        vm.isLoading = false;
      });
    },
    editorder() {
      //沒輸入，預設1
      const vm = this;
      const id = vm.ordertemp.id;
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/order/${id}`;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.put(api, {data:vm.ordertemp}).then(response => {
        vm.orders = response.data.orders;
        $("#editOrder").modal("hide");
        vm.getorder();
        vm.isLoading = false;
      });
    },
    openModal(item) {
      this.ordertemp = Object.assign({}, item); //複製一個新物件

      $("#editOrder").modal("show");
    }
  },
  components: {
    pagination
  },
  created() {
    this.getorder();
    this.$bus.$on("getprd_emit", page => {
      //vue creat時 監聽getprd_emit事件
      this.getorder(page);
    });
  }
};
</script>


