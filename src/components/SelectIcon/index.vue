<script setup lang="ts">
import { computed, ref } from "vue";
import VirtualList from "vue3-virtual-scroll-list";
import IconRow from "./IconRow.vue"; // 引入新组件
import * as LucideIconsImport from "lucide-vue-next";
import { Popover, Button } from "ant-design-vue";
import CustomIcon from "@/components/CustomIcon.vue";
const LucideIcons = LucideIconsImport as Record<string, any>;

const props = defineProps<{ value?: string }>();
const emit = defineEmits<{ (e: "update:value", val: string): void }>();

const search = ref("");
const iconNames = Object.keys(LucideIcons).filter(
  (name) => name !== "Icon" && name !== "icons" && name !== "createLucideIcon",
);
console.log(iconNames, "lucide-vue-next");

const filteredIcons = computed(() =>
  search.value
    ? iconNames.filter((name) =>
        name.toLowerCase().includes(search.value.toLowerCase()),
      )
    : iconNames,
);

const iconsPerRow = 12;
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
    emit("update:value", iconName);
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Popover placement="top" trigger="click">
      <template #content>
        <div class="w-[540px] h-[400px] flex flex-col">
          <div class="w-full flex items-center justify-between gap-2 mb-2">
            <input
              v-model="search"
              placeholder="搜索图标"
              class="px-2 py-1 border rounded text-sm flex-grow"
            />
          </div>
          <VirtualList
            :data-key="(item: any) => item.join('-')"
            :data-sources="groupedIcons"
            :data-component="IconRow"
            :keeps="12"
            :size="6 * 12"
            :horizontal="true"
            class="overflow-x-auto"
            :extra-props="{
              onSelect: handleSelect,
            }"
          />
        </div>
      </template>
      <div class="flex items-center gap-2">
        <Button>
          <template #icon>
            <component
              v-if="LucideIcons?.[props?.value || '']"
              :is="LucideIcons?.[props?.value || '']"
              style="width: 18px; height: 18px"
            />
          </template>
          <span class="text-xs truncate" v-if="!props.value"> 选择图标 </span>
        </Button>
      </div>
    </Popover>
  </div>
</template>
