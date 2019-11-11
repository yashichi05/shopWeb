import Vue from 'vue';
import VueRouter from 'vue-router';

// import home from '@/components/HelloWorld'
import login from '@/components/page/login'
import dashboard from '@/components/admin'
import product from '@/components/page/product'
import order from '@/components/page/order'
import test from '@/components/page/test'
import coupon from '@/components/page/coupon'
import cus from '@/components/page/cus_order'
import pay from '@/components/order_pay'
import credit from '@/components/page/credit_pay'
import home from '@/components/home'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '*', redirect: 'login' },
    // 动态路径参数 以冒号开头
    // { path: '/', component: home ,meta:{requiresAuth: true}},
    {
      path: '/admin',redirect:'/admin/product', component: dashboard, children: [
        { path: 'cus', component: cus },
        { path: 'product', component: product, meta: { requiresAuth: true } },
        { path: 'order', component: order, meta: { requiresAuth: true } },
        { path: 'coupon', component: coupon, meta: { requiresAuth: true } }

      ], meta: { requiresAuth: true },
    },
    { path: '/', component: home },
    {
      path: '/pay', component: pay
    },
    {
      path: '/credit', component: credit
    },
    { path: '/login', component: login },
    { path: '/test', component: test, meta: { data: 'test' } }
  ]
});