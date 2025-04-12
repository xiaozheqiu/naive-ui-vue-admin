<template>
  <n-icon
    :size="props.size || 18"
    :color="props.color"
    @click="props.click"
    :class="props?.class ?? 'hover:text-green-500'">
    <component :is="icon" :strokeWidth="props.strokeWidth ?? 1" />
  </n-icon>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { NIcon } from "naive-ui";
import {
  PanelLeftClose,
  PanelLeftOpen,
  BabyIcon,
  Cable,
  DamIcon,
  EarOffIcon,
  File,
  Globe2,
  ChevronDown,
  RotateCw,
  Expand,
  Bell,
  Languages,
  Sun,
  Moon,
} from "lucide-vue-next";

const icons = {
  PanelLeftClose: PanelLeftClose,
  PanelLeftOpen: PanelLeftOpen,
  BabyIcon: BabyIcon,
  Cable: Cable,
  DamIcon: DamIcon,
  EarOffIcon: EarOffIcon,
  File: File,
  Globe2: Globe2,
  ChevronDown: ChevronDown,
  RotateCw: RotateCw,
  Expand: Expand,
  Bell: Bell,
  Languages: Languages,
  Sun: Sun,
  Moon: Moon,
};

interface CustomIconProps {
  name: keyof typeof icons;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  class?: string;
  click?: () => void;
}

const props = defineProps<CustomIconProps>();

const icon = icons?.[props?.name];
</script>
