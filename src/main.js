import "./assets/main.css";
import "flowbite";
import VueCookies from "vue-cookies";
import { createApp } from "vue";
import { createPinia } from "pinia";
import Vue3Lottie from "vue3-lottie";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { FaEye, FaEyeSlash } from "oh-vue-icons/icons";
import App from "./App.vue";
import router from "./router/route";
import Vue3Toastify from "vue3-toastify";
const app = createApp(App);

addIcons(FaEye, FaEyeSlash);

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
});

app.component("v-icon", OhVueIcon);
app.use(VueCookies);
const pinia = createPinia();
app.use(Vue3Lottie);
app.use(pinia);
app.use(router);

app.mount("#app");
