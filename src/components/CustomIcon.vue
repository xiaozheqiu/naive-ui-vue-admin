<template>
  <n-icon
    v-if="!props.isOnlyIcon"
    :size="props.size || 18"
    :color="props.color"
    @click="props.click"
    :class="props?.class ?? 'hover:text-green-500'"
  >
    <component :is="icon" :strokeWidth="props.strokeWidth ?? 1" />
  </n-icon>

  <component
    v-else
    :is="icon"
    :strokeWidth="props.strokeWidth ?? 1"
    :size="props.size || 18"
    :color="props.color"
    @click="props.click"
    :class="props?.class ?? ''"
  />
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { NIcon } from "naive-ui";
import { icons } from "../tools/icons";

interface CustomIconProps {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  strokeWidth?: number;
  class?: string | string[];
  click?: () => void;
  isOnlyIcon?: boolean;
}

const props = defineProps<CustomIconProps>();

const icon = icons?.[props?.name];
</script>
