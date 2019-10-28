<template lang="pug">
div
  loading(:active.sync="isLoading")
  #prdModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
    .modal-dialog.modal-lg(role='document')
      .modal-content.border-0
        .modal-header
          h5#exampleModalLabel.modal-title
              span {{prd_info.title}}
          button.close(type='button', data-dismiss='modal', aria-label='Close')
              span(aria-hidden='true') ×
        .modal-body
          .card
            img.card-img-top(:src='prd_info.imageUrl')
            .card-body
              h6.text-right.card-text {{prd_info.category}}
              .rounded.bg.border.border-primary.p-3
                h5.card-title {{prd_info.title}}
                hr
                p.card-text {{prd_info.description}}
                
                p.mt-3.p-3.bg-light.card-text {{prd_info.content}}
              div.d-flex.justify-content-between
                h5.w-100.text-right.card-text(v-if = "!prd_info.price") {{prd_info.origin_price | c_filter}}/{{prd_info.unit}}
                del.card-text(v-if = "prd_info.price")
                  h5 {{prd_info.origin_price | c_filter}}/{{prd_info.unit}}
                h5.card-text(v-if = "prd_info.price") {{prd_info.price | c_filter}}/{{prd_info.unit}}
  

        .modal-footer.justify-content-between
          .input-group.col-4
              .input-group-prepend
                  label.input-group-text(for='inputGroupSelect01') 選項
              select(v-model="prd_info.num")#inputGroupSelect01.custom-select
                  option(:value="num" v-for="num in 10" :key="num") 選購{{num}}{{prd_info.unit}}


          button.btn.btn-primary(@click="addCart(prd_info.id,prd_info.num)" type='button') 
            i.fas.fa-spinner.fa-spin(v-if="prd_info.id == status.addcart_id")
            | 加入購物車
  .row.mt-4
    .col-md-4.mb-4(v-for="(item,index) in products" :key="item.id")
      .card.border-0.shadow-sm
        div(:style="{backgroundImage: `url(${item.imageUrl})`}" style='height: 150px; background-size: cover; background-position: center')
        .card-body
          span.badge.badge-secondary.float-right.ml-2 {{item.category}}
          h5.card-title
            a.text-dark(href='#') {{item.title}}
          p.card-text {{item.content}}
          .d-flex.align-items-baseline(:class="item.origin_price?'justify-content-between':'justify-content-end'")
            del.h6(v-if = "item.origin_price") {{item.origin_price | c_filter}}
            .h5 {{item.price | c_filter}}
        .card-footer.d-flex
          button.btn.btn-outline-secondary.btn-sm(type='button' @click="getprd_info(item.id)")
            i.fas.fa-spinner.fa-spin(v-if="status.loading_id == item.id")
            |查看更多
          button.btn.btn-outline-danger.btn-sm.ml-auto(type='button' @click="addCart(item.id)")
            i.fas.fa-spinner.fa-spin(v-if="status.addcart_id == item.id")
            |加到購物車
  pagination

  table.table.table-striped.table-dark
    thead
        tr
            th(scope='col') #
            th(scope='col') 品名
            th(scope='col') 數量
            th.text-right(scope='col') 單價
            th.text-right(scope='col') 總價
    tbody
        tr(v-for="(prd,index) in carts" :key="index" )
            th(scope='row')
              a(href="#" @click.prevent="rmCart(prd.id)") 刪
            td {{prd.product.title}}
              span.text-danger(v-if="prd.coupon") (已使用優惠券)
            td {{prd.qty}}/{{prd.product.unit}}
            td.text-right {{prd.product.price?prd.product.price:prd.product.origin_price | c_filter}}
            td.text-right {{prd.total | c_filter}}
        tr
          td(colspan="5")
          
            .d-flex.justify-content-end
              .input-group.mb-3.col-3
                .input-group-prepend
                  .btn.btn-outline-secondary(@click="usecp")  使用優惠券
                input.form-control(type='text', v-model="cp_code" aria-label='Sizing example input', aria-describedby='inputGroup-sizing-default')
        
              h5.p-1 總價 : {{cart_total.total| c_filter}}

        tr(v-if="cart_total.final_total !== cart_total.total")
          td(colspan="5")
            .d-flex.justify-content-end
              h5.p-1 優惠價 : {{cart_total.final_total| c_filter}}
  .rounded.border.border-danger.p-3
    ValidationObserver(v-slot='{ invalid, passes }')
      .my-5.row.justify-content-center(@submit.prevent="passes(createOrder)")
        form.col-md-6
          ValidationProvider(name="信箱" rules="required|email",v-slot="{ errors }")
            .form-group
              label(for='useremail') Email
              input#useremail.form-control(type='text',name='email', v-model='form.user.email', placeholder='請輸入 Email')
              span.text-danger {{ errors[0] }}
          ValidationProvider(name="收件人姓名" ules="required",v-slot="{ errors }")
            .form-group
              label(for='username') 收件人姓名
              input#username.form-control(type='text', name='name', v-model='form.user.name', placeholder='輸入姓名')
              span.text-danger {{ errors[0] }}
          ValidationProvider(name="收件人電話" rules="required|numeric",v-slot="{ errors }")
            .form-group
              label(for='usertel') 收件人電話
              input#usertel.form-control(type='tel', v-model='form.user.tel', placeholder='請輸入電話')
              span.text-danger {{ errors[0] }}
          ValidationProvider(name="收件人地址" rules="email",v-slot="{ errors }")
            .form-group
              label(for='useraddress') 收件人地址
              input#useraddress.form-control(type='text', name='address', v-model='form.user.address', placeholder='請輸入地址')
              span.text-danger {{ errors[0] }}
          .form-group
            label(for='comment') 留言
            textarea#comment.form-control(name='', cols='30', rows='10', v-model='form.message')
          .text-right
            button.btn.btn-danger 送出訂單

</template>

<script>
import $ from "jquery";
import pagination from "./pagination";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  data() {
    return {
      form:{
        user:{
          email:'',
          name:'',
          tel: '',
          address:''
        },
        message:''
      },
      cp_code:'',
      cart_total:{total:'',final_total:''},
      carts: [],
      running: false,
      isLoading: false,
      status:{loading_id:'',addcart_id:''},
      products: [],
      prd_info:{}
    };
  },
  methods: {
    usecp(){
 //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/coupon`;
      const vm = this;
      const cp_code_data = {code: vm.cp_code}
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.post(api,{data:cp_code_data}).then(response => {
        if (response.data.success){
          console.log('OK');
          vm.getCart();
        }else{
          console.log('not')
        }
        
        
      vm.isLoading = false;
      });
    },
    rmCart(id){
 //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/cart/${id}`;
      const vm = this;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.delete(api).then(response => {
        vm.getCart();
        
      vm.isLoading = false;
      });
    },
    getCart(){
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/cart`;
      console.log(api);
      const vm = this;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.carts = response.data.data.carts;
        vm.cart_total.total = response.data.data.total;
        vm.cart_total.final_total = response.data.data.final_total;
      });

    },
    createOrder(){
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/order`;
      const vm = this;

      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.post(api,{data:vm.form}).then(response => {
        vm.form = {user:{email:'',name:'',tel: '',address:''},message:''};
        console.log(response);
        vm.getCart();
        vm.$router.push({ path: '/pay', query: { id: response.data.orderId }});
      });

    },
    addCart(id,qty =1){
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/cart`;
      const vm = this;
      vm.status.addcart_id = id;
      const cart = {
        product_id : id,
        qty
      }
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.post(api,{data:cart}).then(response => {
        vm.status.addcart_id =''
        $('#prdModal').modal('hide');
        vm.getCart();
      });

    },
    getprd(page = 1) {
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/products?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        vm.products = response.data.products;
        this.$bus.$emit("getpage", response.data.pagination); //1. getprd時發送getpage 事件 並傳送response.data.pagination資料
        vm.isLoading = false;
      });
    },
    getprd_info(id){
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/product/${id}`;
      const vm = this;
      vm.status.loading_id = id;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        vm.prd_info = response.data.product;
        vm.prd_info.num = 1;
        vm.isLoading = false;
        vm.status.loading_id = '';
        $('#prdModal').modal('show');
      });

    },
  },
  components: {
    pagination,
    ValidationObserver,
    ValidationProvider 
  },
  created() {
    let vm = this;
    vm.getprd();
    vm.getCart();
    vm.$bus.$on('getprd_emit', (page) => { //vue creat時 監聽getprd_emit事件
      vm.getprd(page);
    });
  }
};
</script>

