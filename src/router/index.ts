import { createRouter, createWebHistory } from "vue-router";
import { CommonRouter } from "./common";

// 定义路由规则
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/",
    component: () => import("../Layout/index.vue"),
    meta: { requiresAuth: true },
    redirect: "/overview",
    children: CommonRouter,
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
