<template lang="pug">
div
    loading(:active.sync="isLoading")
    .text-right
        button.mt-4.btn.btn-primary(type='button' @click='openModal(true)') 建立新品
        // Modal
    #addprd.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
        .modal-dialog.modal-lg(role='document')
            .modal-content.border-0
                .modal-header.bg-dark.text-white
                    h5#exampleModalLabel.modal-title
                        span 新增產品
                    button.close(type='button', data-dismiss='modal', aria-label='Close')
                        span(aria-hidden='true') ×
                .modal-body
                    .row
                        .col-sm-4
                            .form-group
                                label(for='image') 輸入圖片網址
                                input#image.form-control(v-model="prdtemp.imageUrl" type='text', placeholder='請輸入圖片連結')
                            .form-group
                                label(for='customFile')
                                    | 或 上傳圖片
                                    i.fas.fa-spinner.fa-spin(v-if='status.upfileLoading')
                                input#customFile.form-control(@change="upfile" type='file', ref='files')
                            img.img-fluid(:src="prdtemp.imageUrl" img='https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80', alt='')
                        .col-sm-8
                            .form-group
                                label(for='title') 標題
                                input#title.form-control(v-model="prdtemp.title" type='text', placeholder='請輸入標題')
                            .form-row
                                .form-group.col-md-6
                                    label(for='category') 分類
                                    input#category.form-control(v-model="prdtemp.category" type='text', placeholder='請輸入分類')
                                .form-group.col-md-6
                                    label(for='price') 單位
                                    input#unit.form-control(v-model="prdtemp.unit" type='unit', placeholder='請輸入單位')
                            .form-row
                                .form-group.col-md-6
                                    label(for='origin_price') 原價
                                    input#origin_price.form-control(v-model="prdtemp.origin_price" type='number', placeholder='請輸入原價')
                                .form-group.col-md-6
                                    label(for='price') 售價
                                    input#price.form-control(v-model="prdtemp.price" type='number', placeholder='請輸入售價')
                            hr
                            .form-group
                                label(for='description') 產品描述
                                textarea#description.form-control(v-model="prdtemp.description" type='text', placeholder='請輸入產品描述')
                            .form-group
                                label(for='content') 說明內容
                                textarea#content.form-control(v-model="prdtemp.content" type='text', placeholder='請輸入產品說明內容')
                            .form-group
                                .form-check
                                    input#is_enabled.form-check-input(v-model="prdtemp.is_enabled" true-value="1" false-value="0" type='checkbox')
                                    label.form-check-label(for='is_enabled') 是否啟用
                                    
                .modal-footer
                    i.fas.fa-spinner.fa-spin(v-if='status.prdLoading')
                    button.btn.btn-outline-secondary(type='button', data-dismiss='modal') 取消
                    button.btn.btn-primary(@click='updateprd' type='button') 確認
                    
    #delprd.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
        .modal-dialog(role='document')
            .modal-content.border-0
                .modal-header.bg-danger.text-white
                    h5#exampleModalLabel.modal-title
                        span 刪除產品
                    button.close(type='button', data-dismiss='modal', aria-label='Close')
                        span(aria-hidden='true') ×
                .modal-body 是否刪除 
                    strong.text-danger  {{prdtemp.title}}商品(刪除後將無法恢復)。
                .modal-footer
                    button.btn.btn-outline-secondary(type='button', data-dismiss='modal') 取消
                    button.btn.btn-danger(@click="delprd" type='button') 確認刪除

    table.table.mt-4
        thead
            tr 
                th.d-none.d-lg-table-cell.d-xl-table-cell(width="120") 分類
            
                th 名稱
            
                th.d-none.d-lg-table-cell.d-xl-table-cell.text-right(width="120") 原價
            
                th.d-none.d-lg-table-cell.d-xl-table-cell.text-right(width="120") 售價
            
                th(width="80").d-none.d-lg-table-cell.d-xl-table-cell 啟用
            
                th.text-center(width="140").d-none.d-lg-table-cell.d-xl-table-cell 編輯
        tbody
            template(v-for="(item,index) in products")
                tr.d-lg-none(style="border-top:2px solid gray;")
                    td(colspan="2") 
                        strong {{item.title}}
                tr( :key="item.id")
                    td.d-none.d-lg-table-cell.d-xl-table-cell {{item.category}}
                    td.d-none.d-lg-table-cell.d-xl-table-cell {{item.title}}
                    td.d-none.d-lg-table-cell.d-xl-table-cell.text-right {{item.origin_price | c_filter}}
                    td.d-none.d-lg-table-cell.d-xl-table-cell.text-right {{item.price | c_filter}}
                    td
                        span.text-success(v-if="item.is_enabled == 1") 啟用
                        span(v-else) 關閉
                    td
                        .d-flex.justify-content-end
                            button.btn.btn-outline-primary.btn-sm(@click="openModal(false,item)") 編輯
                            button.btn.btn-outline-secondary.btn-sm(@click="delModal(item)") 刪除
    pagination


</template>

<script>
import $ from 'jquery'
import pagination from './pagination'
export default {
  data() {
    return {
      products: [],
      prdtemp:{},
      isNew: false,
      isLoading: false,
      status: {
          upfileLoading: false,
          prdLoading: false
      }
    };
  },
  methods: {
    getprd(page = 1) {//沒輸入，預設1 
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/products?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        vm.products = response.data.products;
        this.$bus.$emit('getpage',response.data.pagination); //1. getprd時發送getpage 事件 並傳送response.data.pagination資料
        vm.isLoading = false ;
      });
    },
    openModal(isNew,item){
        if(isNew){
            this.prdtemp = {};
            this.isNew = true;
        }
        else{
            this.prdtemp = Object.assign({},item); //複製一個新物件
            this.isNew = false;
        }
        $('#addprd').modal('show');
    },
    delModal(item){
        this.prdtemp = Object.assign({},item); //複製一個新物件
        $('#delprd').modal('show');
    },
    updateprd(){
      let api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/product`;
      let httpMethod = 'post'
      const vm = this;
      vm.status.prdLoading = true;
      if(!vm.isNew){
        api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/product/${vm.prdtemp.id}`;
        httpMethod = 'put';
      }
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http[httpMethod](api,{data: vm.prdtemp}).then(response => {
        console.log(response.data);
        vm.status.prdLoading = false;
        if(response.data.success){
            $('#addprd').modal('hide');
            vm.getprd()
        }
        else{
            console.log('失敗',response.data);
        }
      });
        
    },
    delprd(){
        
        const vm = this;
        vm.isLoading = true;
        let api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/product/${vm.prdtemp.id}`;
        this.$http.delete(api).then(response => {
        vm.isLoading = true;
        if(response.data.success){
            $('#delprd').modal('hide');
            vm.getprd()
        }
        else{
            this.$bus.$emit('message:push',response.data.message,'danger');
        }
      });
    },
    upfile(){
        const uploadFile = this.$refs.files.files[0];
        const vm = this;
        const formData = new FormData();
        vm.status.upfileLoading = true;
        formData.append('file-to-upload',uploadFile);
        let api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/upload`;
        this.$http.post(api,formData,{
            header:{'Content-Type': 'mutipart/form-data'}
        }).then((response) =>{
            vm.status.upfileLoading = false;
            // console.log(response.data);
            if(response.data.success){
                // vm.prdtemp.imageUrl = response.data.imageUrl;
                //教學影片中，因為他都把prdtemp 變成{}，裡面不存在imageUrl 所以需用set賦值
                vm.$set(vm.prdtemp,'imageUrl',response.data.imageUrl);
            }else{
                this.$bus.$emit('message:push',response.data.message,'danger'); //不再bus 裡面會怎樣???????????


            }
            })
    }
  },
  components:{
      pagination
  }, 
  created() {
    this.getprd();
    this.$bus.$on('getprd_emit', (page) => { //vue creat時 監聽getprd_emit事件
      this.getprd(page);
    });
    
  }
};
</script>

