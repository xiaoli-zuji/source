import Vue from "vue";
import App from "./App.vue";
// import axios from 'axios'

Vue.config.productionTip = false;

// 导入less
// import '@/styles/base.less'
// import './styles/base.less'

import router from "./router/index";
import store from "@/store";
// 导入element.js
import "./plugins/element";
// 导入request(封装了axios)
import "./utils/request";

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
