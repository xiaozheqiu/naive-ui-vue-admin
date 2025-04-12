import { icons } from "../tools/icons";
import type { RouteRecordRaw } from "vue-router";

export const CommonRouter: RouteRecordRaw[] = [
  {
    path: "overview",
    name: "Overview",
    meta: {
      title: "Overview",
      icon: icons.PanelLeftOpen,
    },
    children: [
      {
        path: "sub-overview",
        name: "SubOverview",
        component: () => import("../views/SubOverview.vue"),
        meta: {
          title: "Sub Overview",
          icon: icons.DamIcon,
        },
      },
      {
        path: "new-sub-overview",
        name: "NewSubOverview",
        meta: {
          title: "New Sub Overview",
          icon: icons.EarOffIcon,
        },
        children: [
          {
            path: "detail",
            name: "NewSubOverviewDetail",
            component: () => import("../views/Family.vue"),
            meta: {
              title: "New Sub Overview Detail",
              icon: icons.File,
            },
          },
        ],
      },
    ],
  },
  {
    path: "settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      title: "Settings",
      icon: icons.Bell,
    },
  },
  {
    path: "reports",
    name: "Reports",
    component: () => import("../views/Reports.vue"),
    meta: { title: "Reports", icon: icons.Cable },
  },
];
