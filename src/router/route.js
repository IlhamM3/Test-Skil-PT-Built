import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import MyProfile from "@/views/profile/profile.vue";
import Summary from "@/views/menu/Summary.vue";
import Customer from "@/views/menu/Customer.vue";
import Transaction from "@/views/menu/Transaction.vue";
import AuthLayout from "@/layouts/Auth.vue";
import MainLayout from "@/layouts/Main.vue";
import { getCookies } from "@/service/cookies";

function isLoggedIn() {
  const token = getCookies("token");
  return !!token;
}

const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "login", name: "login", component: Login },
      { path: "register", name: "register", component: Register },
    ],
  },
  {
    path: "/dashboard",
    component: MainLayout,
    meta: { Auth: true },
    children: [
      { path: "", name: "dashboard", component: Summary },
      { path: "profile", name: "dashboard.profile", component: MyProfile },
      { path: "Customer", name: "dashboard.customer", component: Customer },
      {
        path: "transaction",
        name: "dashboard.transaction",
        component: Transaction,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: () => {
      return isLoggedIn() ? "/dashboard" : "/auth/login";
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "bg-gray-200 text-blue-600 font-semibold",
});

router.beforeEach((to, from, next) => {
  if (to.meta.Auth && !isLoggedIn()) {
    next("/auth/login");
  } else if (
    (to.path === "/auth/login" || to.path === "/auth/register") &&
    isLoggedIn()
  ) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
