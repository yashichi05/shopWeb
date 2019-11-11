<template lang="pug">
div
    loading(:active.sync="isLoading")
    .text-right
        button.mt-4.btn.btn-primary(type='button' @click='openModal(true)') 建立優惠券
        // Modal
    #addcp.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
        .modal-dialog.modal-sm(role='document')
            .modal-content.border-0
                .modal-header.bg-dark.text-white
                    h5#exampleModalLabel.modal-title
                        span 新增折扣券
                    button.close(type='button', data-dismiss='modal', aria-label='Close')
                        span(aria-hidden='true') ×
                .modal-body
                    .input-group.mb-3
                        .input-group-prepend
                            span#inputGroup-sizing-default.input-group-text  名稱
                        input.form-control(v-model="cptemp.title" type='text', aria-label='Sizing example input', aria-describedby='inputGroup-sizing-default')

                    .input-group.mb-3
                        .input-group-prepend
                            span#inputGroup-sizing-default.input-group-text  折扣碼
                        input.form-control(v-model="cptemp.code" type='text', aria-label='Sizing example input', aria-describedby='inputGroup-sizing-default')

                    .input-group.mb-3
                        .input-group-prepend
                            span#inputGroup-sizing-default.input-group-text  折扣(%)
                        input.form-control(v-model="cptemp.percent" type='number', aria-label='Sizing example input', aria-describedby='inputGroup-sizing-default')

                    .input-group.mb-3
                        .input-group-prepend
                            span#inputGroup-sizing-default.input-group-text  到期日
                        input.form-control(v-model="cptemp.due_date" type='date', aria-label='Sizing example input', aria-describedby='inputGroup-sizing-default')

                    .input-group.mb-3.text-right
                        label  
                            input(v-model="cptemp.is_enabled" type='checkbox' ,true-value="1" ,false-value="0", aria-label='Checkbox for following text input')
                            | 啟用


                .modal-footer
                    i.fas.fa-spinner.fa-spin(v-if='status.prdLoading')
                    button.btn.btn-outline-secondary(type='button', data-dismiss='modal') 取消
                    button.btn.btn-primary(@click='updatecp' type='button') 確認
                    
    #delcp.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
        .modal-dialog(role='document')
            .modal-content.border-0
                .modal-header.bg-danger.text-white
                    h5#exampleModalLabel.modal-title
                        span 刪除折扣券
                    button.close(type='button', data-dismiss='modal', aria-label='Close')
                        span(aria-hidden='true') ×
                .modal-body 是否刪除 
                    strong.text-danger  {{cptemp.title}}折扣券(刪除後將無法恢復)。
                .modal-footer
                    button.btn.btn-outline-secondary(type='button', data-dismiss='modal') 取消
                    button.btn.btn-danger(@click="delcp" type='button') 確認刪除

    table.table.mt-4
        thead
            tr 
                th(width="120") 名稱
            
                th 折扣碼
            
                th.d-none.d-lg-table-cell.d-xl-table-cell.text-right(width="120") 折扣比例
            
                th.d-none.d-lg-table-cell.d-xl-table-cell.text-right(width="120") 到期日
            
                th(width="80") 啟用
            
                th.text-center(width="140") 編輯
        tbody
          template(v-for="(item,index) in cps" )
              tr(:key="item.id")
                  td {{item.title}}
                  td {{item.code}}
                  td.d-none.d-lg-table-cell.d-xl-table-cell {{item.percent}}
                  td.d-none.d-lg-table-cell.d-xl-table-cell {{item.due_date | stamp}}
                  td
                      span.text-success(v-if="item.is_enabled") 啟用
                      span(v-else) 關閉
                  td
                      .d-flex
                          button.btn.btn-outline-primary.btn-sm(@click="openModal(false,item)") 編輯
                          button.btn.btn-outline-secondary.btn-sm(@click="delModal(item)") 刪除
    pagination


</template>

<script>
import $ from "jquery";
import pagination from "./pagination";
export default {
  data() {
    return {
      cps: [],
      cptemp_date: "",
      cptemp: {},
      isNew: false,
      isLoading: false,
      status: {
        prdLoading: false
      }
    };
  },
  methods: {
    covertString(num) {
      if (!num) {
        return "";
      }
      let newDate = new Date();
      newDate.setTime(num * 1000);
      let year = newDate.getFullYear();
      // Minutes part from the timestamp
      let month = "0" + (newDate.getMonth() + 1);
      // Seconds part from the timestamp
      let day = "0" + newDate.getDate();
      return `${year}-${month.substr(-2)}-${day.substr(-2)}`;
    },
    covertStamp(time) {
      let vm = this;
      let timeNum = Date.parse(time);
      return timeNum / 1000;
    },
    getcp(page = 1) {
      //沒輸入，預設1
      const api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http.get(api).then(response => {
        vm.cps = response.data.coupons;
        this.$bus.$emit("getpage", response.data.pagination); //1. getprd時發送getpage 事件 並傳送response.data.pagination資料
        vm.isLoading = false;
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.cptemp = {};
        this.isNew = true;
      } else {
        this.cptemp = Object.assign({}, item); //複製一個新物件
        this.cptemp.due_date = this.covertString(this.cptemp.due_date); //打開舊有資料時 將時間戳記轉換到temp 中顯示
        this.isNew = false;
      }
      $("#addcp").modal("show");
    },
    delModal(item) {
      this.cptemp = Object.assign({}, item); //複製一個新物件
      $("#delcp").modal("show");
    },
    updatecp() {
      let api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/coupon`;
      let httpMethod = "post";
      const vm = this;
      vm.status.prdLoading = true;
      if (!vm.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/coupon/${vm.cptemp.id}`;
        httpMethod = "put";
      }
      vm.cptemp.due_date = vm.covertStamp(vm.cptemp.due_date); //上傳資料時 將temp資料轉回戳記 送出
      //process.env.APIPATH 環境變數需至 config/prod.evn.js(正式版)) or dev.env.js 加入
      this.$http[httpMethod](api, { data: vm.cptemp }).then(response => {
        console.log(response.data);
        vm.status.prdLoading = false;
        if (response.data.success) {
          $("#addcp").modal("hide");
          vm.getcp();
        } else {
          console.log("失敗", response.data);
        }
      });
    },
    delcp() {
      const vm = this;
      vm.isLoading = true;
      let api = `${process.env.APIPATH}/api/${process.env.CUS_PATH}/admin/coupon/${vm.cptemp.id}`;
      this.$http.delete(api).then(response => {
        vm.isLoading = true;
        if (response.data.success) {
          $("#delcp").modal("hide");
          vm.getcp();
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    }
  },
  components: {
    pagination
  },
  created() {
    this.getcp();
    this.$bus.$on("getprd_emit", page => {
      //vue creat時 監聽getprd_emit事件
      this.getcp(page);
    });
  }
};
</script>


