import type { RouteRecordRaw } from "vue-router";

// tips: 如果懒加载的组件较大，加载时间较长，可以在加载期间显示一个加载动画。
// Vue 提供了 defineAsyncComponent，可以结合 suspense 使用

export const CommonRouter: RouteRecordRaw[] = [
  // {
  //   path: "overview",
  //   name: "Overview",
  //   // 添加重定向到第一个子路由
  //   redirect: "/overview/sub-overview",
  //   meta: {
  //     title: "Overview",
  //     icon: icons.PanelLeftOpen,
  //   },
  //   children: [
  //     {
  //       path: "sub-overview",
  //       name: "SubOverview",
  //       component: () => import("../views/SubOverview.vue"),
  //       meta: {
  //         title: "Sub Overview",
  //         icon: icons.DamIcon,
  //       },
  //     },
  //     {
  //       path: "new-sub-overview",
  //       name: "NewSubOverview",
  //       meta: {
  //         title: "New Sub Overview",
  //         icon: icons.EarOffIcon,
  //       },
  //       children: [
  //         {
  //           path: "detail",
  //           name: "NewSubOverviewDetail",
  //           component: () => import("../views/Family.vue"),
  //           meta: {
  //             title: "New Sub Overview Detail",
  //             icon: icons.File,
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    path: "settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      title: "Settings",
      icon: "Bell",
    },
  },
  // {
  //   path: "reports",
  //   name: "Reports",
  //   component: () => import("../views/Reports.vue"),
  //   meta: { title: "Reports", icon: icons.Cable },
  // },

  // {
  //   path: "system",
  //   name: "System",
  //   // 添加重定向到第一个子路由
  //   redirect: "/system/menus",
  //   meta: {
  //     title: "系统设置",
  //     icon: icons.MonitorCog,
  //   },
  //   children: [
  //     {
  //       path: "menus",
  //       name: "Menus",
  //       component: () => import("../views/admin/Menus.vue"),
  //       meta: {
  //         title: "菜单管理",
  //         icon: icons.Menu,
  //       },
  //     },
  //   ],
  // },
];
