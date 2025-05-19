<!-- IconRow.vue -->
<script setup lang="ts">
import * as LucideIconsImport from "lucide-vue-next";
import { defineProps } from "vue";

const LucideIcons = LucideIconsImport as Record<string, any>;

// 修改为接收 VirtualList 传来的 source prop
const props = defineProps<{
  source: string[]; // VirtualList 会传 source 而不是 item
  index: number;
  onSelect: (name: string) => void;
}>();
</script>

<template>
  <div class="flex gap-2 p-1">
    <div
      v-for="name in source"
      :key="name"
      class="w-[60px] text-center cursor-pointer p-2 rounded hover:bg-gray-100 transition"
      @click="props?.onSelect(name)"
    >
      <component
        :is="LucideIcons[name]"
        style="width: 20px; height: 20px"
        class="mx-auto"
      />
      <div class="text-xs truncate">{{ name }}</div>
    </div>
  </div>
</template>
