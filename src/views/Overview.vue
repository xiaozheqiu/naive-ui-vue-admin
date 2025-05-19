<script setup lang="ts">
import { ref, computed } from "vue";
import VirtualList from "vue3-virtual-scroll-list";
import IconRow from "../IconRow.vue";
import * as LucideIconsImport from "lucide-vue-next";
const LucideIcons = LucideIconsImport as Record<string, any>;

// 获取所有图标名称
const iconNames = Object.keys(LucideIcons);

const selectedIcon = ref("");
const search = ref("");

// 过滤图标
const filteredIcons = computed(() =>
  search.value
    ? iconNames.filter((name) =>
        name.toLowerCase().includes(search.value.toLowerCase()),
      )
    : iconNames,
);

// 每行显示几个图标
const iconsPerRow = 5;

// 将图标数组按每组 iconsPerRow 个进行分组
const groupedIcons = computed(() => {
  const result = [];
  const list = filteredIcons.value;
  for (let i = 0; i < list.length; i += iconsPerRow) {
    result.push(list.slice(i, i + iconsPerRow));
  }
  return result;
});

function handleSelect(iconName: string) {
  if (iconNames.includes(iconName)) {
    selectedIcon.value = iconName;
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span>图标：</span>
    <a-popover title="选择图标" placement="bottom" trigger="click">
      <template #content>
        <div class="max-w-[480px] max-h-[260px] flex flex-col">
          <input
            v-model="search"
            placeholder="搜索图标"
            class="mb-2 px-2 py-1 border rounded text-sm"
            style="width: 100%"
          />
          <VirtualList
            :data-key="(item) => item.join('-')"
            :data-sources="groupedIcons"
            :data-component="IconRow"
            :keeps="12"
            :size="64"
            :horizontal="true"
            class="overflow-x-auto"
            :extra-props="{
              onSelect: handleSelect,
            }"
          />
        </div>
      </template>
      <a-button size="small" type="primary" ghost>
        <template #icon>
          <component
            v-if="LucideIcons[selectedIcon]"
            :is="LucideIcons[selectedIcon]"
            style="width: 18px; height: 18px"
          />
        </template>
        {{ selectedIcon || "选择图标" }}
      </a-button>
    </a-popover>
    <span v-if="selectedIcon" class="ml-2 text-gray-500 text-xs">{{
      selectedIcon
    }}</span>
  </div>
</template>
