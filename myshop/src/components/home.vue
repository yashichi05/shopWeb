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
              h5.text-right.pr-1
                span.badge.badge-secondary.text-right.card-text {{prd_info.category}}
              .rounded.bg.border.border-primary.p-3
                h5.card-title {{prd_info.title}}
                hr
                .card-text(v-html="prd_info.description")
                
                .mt-3.p-3.bg-light.card-text(v-html="prd_info.content")
              div.d-flex.mt-3(:class="prd_info.origin_price?'justify-content-between':'justify-content-end'")
                del.card-text.h6(v-if = "prd_info.origin_price") {{prd_info.origin_price | c_filter}}/{{prd_info.unit}}
                .h5.card-text {{prd_info.price | c_filter}}/{{prd_info.unit}}
  

        .modal-footer.justify-content-between
          .input-group.col-6.col-lg-4
              .input-group-prepend
                  label.input-group-text.d-none.d-lg-block(for='inputGroupSelect01') 選項
              select(v-model="prd_info.num")#inputGroupSelect01.custom-select
                  option(:value="num" v-for="num in 10" :key="num") 選購{{num}}{{prd_info.unit}}


          button.btn.btn-danger(@click="addCart(prd_info.id,prd_info.num)" type='button') 
            i.fas.fa-spinner.fa-spin(v-if="prd_info.id == status.addcart_id")
            | 加入購物車
  #buyModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
    .modal-dialog.modal-lg(role='document')
      .modal-content.border-0
        .modal-header
          h5#exampleModalLabel.modal-title
              span 購買人資料
          button.close(type='button', data-dismiss='modal', aria-label='Close')
              span(aria-hidden='true') ×
        .modal-body
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
                ValidationProvider(name="收件人電話" rules="required",v-slot="{ errors }")
                  .form-group
                    label(for='usertel') 收件人電話
                    input#usertel.form-control(type='tel', v-model='form.user.tel', placeholder='請輸入電話')
                    span.text-danger {{ errors[0] }}
                ValidationProvider(name="收件人地址" rules="required",v-slot="{ errors }")
                  .form-group
                    label(for='useraddress') 收件人地址
                    input#useraddress.form-control(type='text', name='address', v-model='form.user.address', placeholder='請輸入地址')
                    span.text-danger {{ errors[0] }}
                .form-group
                  label(for='comment') 留言
                  textarea#comment.form-control(name='', cols='30', rows='10', v-model='form.message')
                .text-right
                  button.btn.btn-danger 送出訂單
  
  header
    #navbarHeader.collapse.bg-danger.fixed-top
      .container
        .row.mt-5
          table.table.mt-2
            thead
              tr
                th(scope='col')   
                th(scope='col') 品名
                th(scope='col' width="80px") 數量
                th.d-none.d-lg-table-cell.text-right(scope='col') 單價
                th.text-right(scope='col') 總價
            tbody
                tr(v-for="(prd,index) in carts" :key="index" )
                  th(scope='row')
                    a.text-dark(href="#" @click.prevent="rmCart(prd.id)") 
                      i.far.fa-trash-alt(style="opacity:0.5")
                  td 
                    .cartprdtitle {{prd.product.title}}
                      span(style="color:white;" v-if="prd.coupon") (已使用優惠券)
                  td {{prd.qty}}/{{prd.product.unit}}
                  td.d-none.d-lg-table-cell.text-right {{prd.product.price?prd.product.price:prd.product.origin_price | c_filter}}
                  td.text-right {{prd.total | c_filter}}
                tr
                  td(colspan="5")
                    hr
                  
                    .d-flex.justify-content-end.align-items-lg-center.flex-column.flex-lg-row.align-items-end
                      .input-group.col-lg-3.col-7(style="opacity: 0.7")
                        .input-group-prepend
                          .btn.btn-outline-dark(@click="usecp")  使用優惠券
                        input.cusform.form-control.border.border-dark(type='text', v-model="cp_code" aria-label='Sizing example input', aria-describedby='inputGroup-sizing-default')
                
                      h5.font-weight-bold.p-1.text-white 總價 : {{cart_total.total| c_filter}}

                tr(v-if="cart_total.final_total !== cart_total.total")
                  td(colspan="5")
                    .d-flex.justify-content-end
                      h5.font-weight-bold.p-1.text-white 優惠價 : {{cart_total.final_total| c_filter}}
                tr
                  td(colspan="5")
                    button.float-right.btn.btn-dark(v-if="carts.length !== 0" @click="buyform") 結帳去
    .navbar.fixed-top.navbar-danger.bg-danger.shadow-sm
      .container.d-flex.justify-content-between.position-relative
        a.navbar-brand.d-flex.align-items-center.text-white(href='#')
          i.fas.fa-compact-disc
          strong.ml-2 廚具購物
        button.navbar-toggler(type='button', data-toggle='collapse', data-target='#navbarHeader', aria-controls='navbarHeader', aria-expanded='false', aria-label='Toggle navigation')
          i.fas.fa-cart-arrow-down.text-white(style="opacity:0.5")
        .cartcount.position-absolute.l-5.text-black.border.rounded-circle.bg-white {{cartCount}}
  main(role='main')
    section.jumbotron.text-center.banner
      //- .container
      //-   h1.jumbotron-heading Album example
      //-   p.lead.text-muted
      //-     | Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.
      //-   p
      //-     a.btn.btn-primary.my-2(href='#') Main call to action
      //-     a.btn.btn-secondary.my-2(href='#') Secondary action
    .album.py-5.bg-light
      .container
        .row
        
          .col-lg-4.col-md-6(v-if="item.is_enabled == 1" v-for="(item,index) in products" :key="item.id")
            .card.mb-4.shadow-sm
              .prdimg(:style="{backgroundImage: `url(${item.imageUrl})`}" style='background-size: cover; background-position: center')

              .card-body
                p.card-text
                  | {{item.title}}
                  
                .d-flex.align-items-baseline(:class="item.origin_price?'justify-content-between':'justify-content-end'")
                  del.h6(v-if = "item.origin_price") {{item.origin_price | c_filter}}
                  .h5 {{item.price | c_filter}}
                .d-flex.justify-content-between.align-items-center
                  .btn-group
                    button.btn.btn-sm.btn-outline-secondary(type='button'  @click="getprd_info(item.id)") 
                      i.fas.fa-spinner.fa-spin(v-if="status.loading_id == item.id")
                      |查看詳細
                    button.btn.btn-sm.btn-outline-secondary(type='button'  @click="addCart(item.id)")
                      i.fas.fa-spinner.fa-spin(v-if="status.addcart_id == item.id")
                      |加到購物車
                  small.text-muted.align-self-end.mb-1
                    span.badge.badge-secondary.float-right.ml-2 {{item.category}}
        pagination
  footer.text-muted
    .container
      p.gettop.float-right
        a.text-secondary(style="text-decoration: none;" href='#') 回到最頂端
          i.fas.fa-angle-up.ml-2  
      p 
        |此為展示用頁面，
        router-link.text-danger.text-decoration-none(to="/admin") 後台管理連結
      p 使用的vue cli製作；已串接歐付寶付款API(測試用)；商店其他功能API，由六角學院課程提供。
</template>



<script>
import pay from "./order_pay";
import $ from "jquery";

export default {
  components: {
    pay
  }
};
</script>


<script>
import $ from "jquery";
import pagination from "./page/pagination";
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  data() {
    return {
      windowW:'',
      form: {
        user: {
          email: "",
          name: "",
          tel: "",
          address: ""
        },
        message: ""
      },
      cp_code: "",
      cart_total: { total: "", final_total: "" },
      carts: [],
      running: false,
      isLoading: false,
      status: { loading_id: "", addcart_id: "" },
      products: [],
      prd_info: {}
    };
  },
  methods: {
    usecp() {
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/coupon`;
      const vm = this;
      const cp_code_data = { code: vm.cp_code };
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.post(api, { data: cp_code_data }).then(response => {
        if (response.data.success) {
          console.log("OK");
          vm.getCart();
        } else {
          console.log("not");
        }

        vm.isLoading = false;
      });
    },
    rmCart(id) {
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
    getCart() {
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/cart`;
      const vm = this;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.carts = response.data.data.carts;
        vm.cart_total.total = response.data.data.total;
        vm.cart_total.final_total = response.data.data.final_total;
      });
    },
    createOrder() {
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/order`;
      const vm = this;
      $("#buyModal").modal("hide");
      $(".navbar-toggler").click();
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.post(api, { data: vm.form }).then(response => {
        vm.isLoading = false;
        vm.form = {
          user: { email: "", name: "", tel: "", address: "" },
          message: ""
        };
        vm.getCart();
        // vm.$router.push({ path: '/pay', query: { id: response.data.orderId }});
        // let routeData = vm.$router.push({ path: '/pay', query: { id: response.data.orderId }});
        let routeData = vm.$router.resolve({
          path: "/pay",
          query: { id: response.data.orderId }
        });
        setTimeout(function() {
          window.open(routeData.href, "_blank");
        }, 1000);
      });
    },
    addCart(id, qty = 1) {
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/cart`;
      const vm = this;
      vm.status.addcart_id = id;
      const cart = {
        product_id: id,
        qty
      };
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.post(api, { data: cart }).then(response => {
        vm.status.addcart_id = "";
        $("#prdModal").modal("hide");
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
    buyform() {
      $("#buyModal").modal("show");
    },
    getprd_info(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/product/${id}`;
      const vm = this;
      vm.status.loading_id = id;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        vm.prd_info = response.data.product;
        vm.prd_info.num = 1;
        vm.isLoading = false;
        vm.status.loading_id = "";
        $("#prdModal").modal("show");
      });
    }
  },
  computed: {
    cartCount() {
      let vm = this;
      return vm.carts.length;
    }
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
    vm.$bus.$on("getprd_emit", page => {
      //vue creat時 監聽getprd_emit事件
      vm.getprd(page);
    });
    $(window).resize(function() {
      let w_width=$(".prdimg").width();
      $(".prdimg").css("height",w_width);
    });
  },
  updated() {
    let w_width=$(".prdimg").width();
    $(".prdimg").css("height",w_width);
  },
};
</script>

<style lang="sass" scoped>
@media (max-width: 920px)
  .input-group.col-7
    padding-right: 0 !important
  .banner
    // background-image: url('../assets/banner_mobile.png') !important
    height: 60vw !important
  footer
    position: relative
    .gettop
      position: absolute
      bottom: 15px
      right: 30px
@media (min-width: 768px) 
  .jumbotron 
    padding-top: 6rem 
    padding-bottom: 6rem
.cartprdtitle
  max-height: 75px
  overflow: hidden

.banner
  background-image: url('../assets/banner.png') 
  background-position: center 50px 
  background-size: 100% auto 
  background-repeat: no-repeat
  height: 50vw
.navbar
  strong
    margin-top: -3px
.table th
  border: none
.table td
  border: none
.divprd
  height: 100%

.jumbotron 
	padding-top: 3rem 
	padding-bottom: 3rem 
	margin-bottom: 0 
	background-color: #fff 
	.container 
		max-width: 40rem 
.jumbotron 
  p:last-child 
		margin-bottom: 0 
.jumbotron-heading 
	font-weight: 300 

.cartcount
  pointer-events: none
  opacity: 0.4
  display: flex
  justify-content: center
  align-items: center
  right: 10px
  bottom: 5px
  width: 15px
  height: 15px
  font-size: 8px
  font-weight: 800
.jumbotron 
	padding-top: 3rem 
	padding-bottom: 3rem 
	margin-bottom: 0 
	background-color: #fff 
	.container 
		max-width: 40rem 
.jumbotron 
  p:last-child 
		margin-bottom: 0 
.jumbotron-heading 
	font-weight: 300 
footer 
	padding-top: 3rem
	padding-bottom: 3rem
	p 
		margin-bottom: .25rem 
</style>
