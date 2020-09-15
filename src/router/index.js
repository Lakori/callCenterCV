import Vue from "vue";
import VueRouter from "vue-router";

import vMainWrapper from '@/components/containers/v-main-wrapper';

//Login 

import vLogin from '@/pages/authorization/v-login';


//Pages

import callCenter from '@/pages/v-call-center';




Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: vMainWrapper,
    children: [
      {
        path: "/",
        name: "callCenter",
        component: callCenter,
      },
    ]
  },
  {
    path: '/login',
    name: "login",
    component: vLogin,
  },


];

const router = new VueRouter({
  routes
});

export default router;
