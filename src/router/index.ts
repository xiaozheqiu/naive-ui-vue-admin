import { createRouter, createWebHistory } from "vue-router";
import { CommonRouter } from "./common";
import { useTabsStore } from "../store/tabs";
import NotFound from "@/views/NotFound.vue"; // 确保路径正确

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
    redirect: "/overview/sub-overview",
    children: CommonRouter,
  },
  // 404 Route - Must be the last route
  {
    path: "/:pathMatch(.*)*", // Vue Router 4 syntax for catch-all routes
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "页面未找到",
      hideInMenu: true, // 通常不在菜单中显示 404
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log("路由已重新加载");
  console.log(`当前路由: ${to.fullPath}`);
  const tabsStore = useTabsStore();
  if (to.meta.requiresAuth) {
    const isAuthenticated = !!localStorage.getItem("token");
    if (!isAuthenticated) {
      next("/login");
    } else {
      tabsStore.addTab(to);
      next();
    }
  } else {
    next();
  }
});

export default router;
