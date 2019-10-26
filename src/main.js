import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";

// 使用ElementUI组件库
Vue.use(ElementUI);

// 引入全局的权限拦截
import './permission'

// 提示
Vue.config.productionTip = process.env.NODE_ENV === "production";
console.log(process.env.NODE_ENV);
console.log(process.env.VUE_APP_SERVICE_URL);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
