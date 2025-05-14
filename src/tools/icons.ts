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
  X,
  Menu,
  Shrink,
  House,
  LucideChevronUp,
  LucideChevronDown,
  MonitorCog,
} from "lucide-vue-next";
import type { Component } from "vue";
import { NIcon } from "naive-ui";
import { h } from "vue";

export const icons = {
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
  X,
  Menu,
  Shrink,
  House,
  LucideChevronUp,
  LucideChevronDown,
  MonitorCog,
};

export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
