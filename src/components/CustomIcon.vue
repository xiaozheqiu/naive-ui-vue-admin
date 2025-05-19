<template>
  <a-button
    v-if="!props.isOnlyIcon"
    type="text"
    :class="`!w-[30px] !h-[30px] !leading-[0] !p-0 flex items-center justify-center ${props.class}`"
  >
    <template #icon>
      <component
        :is="icons[props.name]"
        v-bind="props"
        :size="props.size || 18"
        :color="props.color"
        :stroke-width="props.strokeWidth || 1.5"
        :absolute-stroke-width="props.absoluteStrokeWidth || false"
        class="inline"
      />
    </template>
    <slot />
  </a-button>

  <component
    v-else
    :is="icons[props.name]"
    :size="props.size || 18"
    :color="props.color"
    :stroke-width="props.strokeWidth || 1.5"
    :absolute-stroke-width="props.absoluteStrokeWidth || false"
    class="inline"
    :class="props.class"
  />
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import * as LucideIcons from "lucide-vue-next";
const icons = LucideIcons;

interface Props {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  class?: string;
  isOnlyIcon?: boolean;
}

const props = defineProps<Props>();
</script>
