import Vue from 'vue';
import Router from 'vue-router';
import VueClipboard from 'vue-clipboard2';
import main from '../views/main';
import gift from '../views/goods/gift/gift';
import giftInfo from '../views/goods/gift/info';
import coupon from '../views/goods/coupon/coupon';
import couponInfo from '../views/goods/coupon/info';
import giftExchange from '../views/order/giftExchange';
import couponExchange from '../views/order/couponExchange';
import refundList from '../views/order/refundList';
import deliverSet from '../views/setting/deliverSet';
import editDeliver from '../views/setting/editDeliver';
import orderDetail from '../views/order/orderDetail';
Vue.use(VueClipboard);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      children: [
        {
          path: '/gift',
          name: 'gift',
          component: gift
        },
        {
          path: '/giftInfo',
          name: 'giftInfo',
          component: giftInfo
        },
        {
          path: '/coupon',
          name: 'coupon',
          component: coupon
        },
        {
          path: '/couponInfo',
          name: 'couponInfo',
          component: couponInfo
        },
        {
          path: '/giftExchange',
          name: 'giftExchange',
          component: giftExchange
        },
        {
          path: '/orderDetail',
          name: 'orderDetail',
          component: orderDetail
        },
        {
          path: '/couponExchange',
          name: 'couponExchange',
          component: couponExchange
        },
        {
          path: '/refundList',
          name: 'refundList',
          component: refundList
        },
        {
          path: '/deliverSet',
          name: 'deliverSet',
          component: deliverSet
        },
        {
          path: '/editDeliver',
          name: 'editDeliver',
          component: editDeliver
        }
      ]
    }
  ]
});

export default router;
