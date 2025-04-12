<template>
  <div class="h-screen w-screen">
    <n-layout has-sider class="h-screen w-screen flex flex-row">
      <n-layout-sider
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        style="max-height: 100%"
        class="h-full flex flex-col"
        :collapsed="isSidebarCollapsed"
        @collapse="setSidebarCollapsed(true)"
        @expand="setSidebarCollapsed(false)">
        <div class="logo h-[48px] flex items-center gap-2 justify-center">
          <img src="/logo.png" alt="Logo" class="h-8 w-8" />
          <div
            class="text-lg font-bold whitespace-nowrap"
            v-if="!isSidebarCollapsed">
            My Application
          </div>
        </div>
        <n-menu
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          class="flex-grow" />
      </n-layout-sider>
      <n-layout content-class="h-screen flex-grow flex flex-col gap-2">
        <n-layout-header
          class="h-[48px] px-2 flex justify-between items-center"
          bordered
          ><div class="flex justify-start items-center gap-2">
            <CustomIcon
              :name="isSidebarCollapsed ? 'PanelLeftOpen' : 'PanelLeftClose'"
              @click="setSidebarCollapsed(!isSidebarCollapsed)"></CustomIcon>

            <n-breadcrumb>
              <n-breadcrumb-item>北京总行</n-breadcrumb-item>
              <n-breadcrumb-item>天津分行</n-breadcrumb-item>
              <n-breadcrumb-item>平山道支行</n-breadcrumb-item>
            </n-breadcrumb>
          </div>
          <div class="flex justify-end items-center gap-4">
            <CustomIcon name="Expand"></CustomIcon>

            <CustomIcon name="RotateCw"></CustomIcon>

            <CustomIcon name="Languages"></CustomIcon>

            <CustomIcon name="Bell"></CustomIcon>

            <CustomIcon
              @click="changeTheme()"
              name="Moon"
              v-if="theme === 'dark'"></CustomIcon>

            <CustomIcon
              @click="changeTheme()"
              name="Sun"
              v-if="theme !== 'dark'"></CustomIcon>

            <n-dropdown :options="dropdownOptions">
              <div class="flex items-center gap-2 group">
                <n-avatar
                  round
                  size="small"
                  src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
                <div class="">超级管理员</div>
                <n-icon
                  class="group-hover:text-green-500 transition-transform group-hover:rotate-180">
                  <CustomIcon name="ChevronDown" class=" "></CustomIcon>
                </n-icon>
              </div>
            </n-dropdown>
          </div>
        </n-layout-header>
        <div class="flex-grow p-2">
          <h1 class="text-3xl font-bold underline">Hello world!</h1>
        </div>
        <n-layout-footer bordered class="h-10 flex items-center justify-center">
          Footer Footer Footer
        </n-layout-footer>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { NIcon } from "naive-ui";
import { computed, h } from "vue";
import { useSystemStore } from "../store/system";
import {
  BabyIcon,
  Cable,
  DamIcon,
  EarOffIcon,
  File,
  Globe2,
} from "lucide-vue-next";
import CustomIcon from "../components/CustomIcon.vue";
import { storeToRefs } from "pinia";

const { theme, isSidebarCollapsed } = storeToRefs(useSystemStore());
const { setSidebarCollapsed, changeTheme } = useSystemStore();

const isDarkTheme = computed(() => theme.value === "dark");

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const dropdownOptions = [
  {
    label: "用户资料",
    key: "profile",
    icon: renderIcon(EarOffIcon),
  },
  {
    label: "编辑用户资料",
    key: "editProfile",
    icon: renderIcon(File),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(Globe2),
  },
];
const menuOptions = [
  {
    label: "且听风吟",
    key: "hear-the-wind-sing",
    icon: renderIcon(BabyIcon),
  },
  {
    label: "1973年的弹珠玩具",
    key: "pinball-1973",
    icon: renderIcon(BabyIcon),
    disabled: true,
    children: [
      {
        label: "鼠",
        key: "rat",
      },
    ],
  },
  {
    label: "寻羊冒险记",
    key: "a-wild-sheep-chase",
    disabled: true,
    icon: renderIcon(Cable),
  },
  {
    label: "舞，舞，舞",
    key: "dance-dance-dance",
    icon: renderIcon(Cable),
    children: [
      {
        type: "group",
        label: "人物",
        key: "people",
        children: [
          {
            label: "叙事者",
            key: "narrator",
            icon: renderIcon(Cable),
          },
          {
            label: "羊男",
            key: "sheep-man",
            icon: renderIcon(DamIcon),
          },
        ],
      },
      {
        label: "饮品",
        key: "beverage",
        icon: renderIcon(DamIcon),
        children: [
          {
            label: "威士忌",
            key: "whisky",
          },
        ],
      },
      {
        label: "食物",
        key: "food",
        children: [
          {
            label: "三明治",
            key: "sandwich",
          },
        ],
      },
      {
        label: "过去增多，未来减少",
        key: "the-past-increases-the-future-recedes",
      },
    ],
  },
];
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-header {
  height: 60px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layout-content {
  flex: 1;
  overflow: auto;
}

.layout-footer {
  height: 40px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
