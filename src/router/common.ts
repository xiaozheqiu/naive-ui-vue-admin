import type { RouteRecordRaw } from "vue-router";

// tips: 如果懒加载的组件较大，加载时间较长，可以在加载期间显示一个加载动画。
// Vue 提供了 defineAsyncComponent，可以结合 suspense 使用

export const CommonRouter: RouteRecordRaw[] = [
  {
    path: "settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      title: "Settings",
      icon: "Bell",
    },
  },
  {
    path: "overview",
    name: "Overview",
    component: () => import("../views/Overview.vue"),
    meta: {
      title: "概览",
      icon: "ChartPie",
    },
  },

  {
    path: "system",
    name: "System",
    // 添加重定向到第一个子路由
    redirect: "/system/menus",
    meta: {
      title: "系统设置",
      icon: "MonitorCog",
    },
    children: [
      {
        path: "menus",
        name: "Menus",
        component: () => import("../views/admin/Menus.vue"),
        meta: {
          title: "菜单管理",
          icon: "Menu",
        },
      },
    ],
  },
];
