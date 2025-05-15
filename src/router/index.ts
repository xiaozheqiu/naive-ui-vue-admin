import { createRouter, createWebHistory } from "vue-router";
import { CommonRouter } from "./common";
import { useTabsStore } from "../store/tabs";
import NotFound from "@/views/NotFound.vue"; // 确保路径正确
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";

// 定义路由规则
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/auth/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/auth/Register.vue"),
  },
  {
    path: "/",
    component: () => import("../Layout/index.vue"),
    meta: { requiresAuth: true },
    redirect: "/settings",
    children: CommonRouter,
  },

  {
    path: "/:pathMatch(.*)*",
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
  next();
  console.log("路由已重新加载");
  console.log(`当前路由: ${to.fullPath}`);
  const tabsStore = useTabsStore();
  const { authData } = storeToRefs(useAuthStore());
  if (to.meta.requiresAuth) {
    const isAuthenticated = !!authData.value.accessToken;
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
