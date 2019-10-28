<template lang="pug">
div
    nav(aria-label='Page navigation example')
        ul.pagination
            li.page-item(:class="{'disabled': !page.has_pre}")
                a.page-link(href='#' aria-label='前頁' @click.prevent="getprd(page.current_page-1)")
                    span(aria-hidden='true') &laquo;
            li.page-item(v-for="(p,i) in page.total_pages" :key="i" :class="{'active':page.current_page === p}" )
                a.page-link(href='#' @click.prevent="getprd(p)") {{p}}

            li.page-item(:class="{'disabled' :!page.has_next}")
                a.page-link(href='#' aria-label='後頁' @click.prevent="getprd(page.current_page+1)")
                    span(aria-hidden='true') &raquo;
        
</template>

<script>
import $ from "jquery";
export default {
  data() {
    return {
      page: {}
    };
  },
  methods: {
    getprd(page) {
      this.$bus.$emit("getprd_emit", page);//發送 getprd_emit 事件 觸發 外部compoent
        console.log(this)
    }
  },
  created() {
    const vm = this;
    vm.$bus.$on("getpage", message => {
      //2.接收到getpage 及資料 執行程式
      vm.page = message;
    });
  }
};
</script>