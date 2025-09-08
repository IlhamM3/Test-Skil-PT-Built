import "./assets/main.css";
import "flowbite";
import VueCookies from "vue-cookies";
import { createApp } from "vue";
import { createPinia } from "pinia";
import Vue3Lottie from "vue3-lottie";
import App from "./App.vue";
import router from "./router/route";
import Vue3Toastify from "vue3-toastify";
const app = createApp(App);

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});

app.use(VueCookies);
const pinia = createPinia();
app.use(Vue3Lottie);
app.use(pinia);
app.use(router);

app.mount("#app");
