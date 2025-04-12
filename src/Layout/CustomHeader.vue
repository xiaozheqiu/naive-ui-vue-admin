<template>
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
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { icons, renderIcon } from "../tools/icons";
import { useSystemStore } from "../store/system";
const { theme, isSidebarCollapsed } = storeToRefs(useSystemStore());
const { setSidebarCollapsed, changeTheme } = useSystemStore();

const dropdownOptions = [
  {
    label: "用户资料",
    key: "profile",
    icon: renderIcon(icons.EarOffIcon),
  },
  {
    label: "编辑用户资料",
    key: "editProfile",
    icon: renderIcon(icons.File),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(icons.Globe2),
  },
];
</script>
