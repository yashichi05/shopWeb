<template>
  <div>
    <navbar />
    <alert />
    <div class="container-fluid">
      <div class="row">
        <side />
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import side from './dash_side';
import navbar from './dash_nav';
import alert from './alert';
export default {
  methods:{
    go(){
      const vm = this;
      vm.$router.push('/admin/product');
    }
  },
  components:{
    side,
    navbar,
    alert
  },
  created() {
    this.go()
  }

};
</script>

<style scoped>
body {
  font-size: 0.875rem;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}


/*
   * Content
   */

[role="main"] {
  padding-top: 133px; /* Space for fixed navbar */
}
@media (min-width: 768px) {
  [role="main"] {
    padding-top: 48px; /* Space for fixed navbar */
  }
}
</style>
