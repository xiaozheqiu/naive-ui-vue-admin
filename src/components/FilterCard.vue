<template>
  <n-card :bordered="false">
    <div class="filter-content-wrapper">
      <n-form ref="formRef" :model="props.formValue" label-placement="left">
        <n-grid
          :x-gap="16"
          :y-gap="12"
          :cols="props.gridCols"
          responsive="screen"
        >
          <template v-for="config in itemsToDisplay" :key="config.path">
            <n-gi v-bind="config.giProps || {}">
              <n-form-item
                :label="config.label"
                :path="config.path"
                v-bind="config.formItemProps || {}"
                :show-feedback="false"
              >
                <component
                  :is="config.control.component"
                  v-model:value="props.formValue[config.path]"
                  v-bind="config.control.props || {}"
                />
              </n-form-item>
            </n-gi>
          </template>

          <n-gi :span="props.actionGiSpan">
            <n-space justify="start" item style="width: 100%">
              <n-button type="primary" @click="handleSearch">搜索</n-button>
              <n-button @click="handleResetClick">重置</n-button>
              <div
                @click="toggleFilters"
                v-if="props.itemConfigs.length > props.defaultVisibleItemsCount"
                class="flex items-center cursor-pointer text-blue-500 justify-center h-full"
              >
                <CustomIcon name="LucideChevronUp" v-if="showAllFilters" />
                <CustomIcon name="LucideChevronDown" v-else />
                {{ showAllFilters ? "收起" : "展开" }}
              </div>
            </n-space>
          </n-gi>
        </n-grid>
      </n-form>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, type Component } from "vue";
import {
  NButton,
  NCard,
  NForm,
  NFormItem,
  NGrid,
  NGi,
  NSpace,
  type FormInst,
  type FormItemProps as NFormItemProps, // Renaming to avoid conflict if needed
} from "naive-ui";
import CustomIcon from "@/components/CustomIcon.vue";

interface FormItemControlConfig {
  component: string | Component; // e.g., 'NInput', 'NSelect', or imported component object
  props?: Record<string, any>; // Props for the control itself
}

export interface FilterItemConfig {
  // Exporting for use in parent component
  path: string; // Used for formValue key and n-form-item path
  label: string;
  giProps?: Record<string, any>; // Props for n-gi, e.g., { span: 1 }
  formItemProps?: Omit<NFormItemProps, "label" | "path">; // Additional props for n-form-item
  control: FormItemControlConfig;
  defaultValue?: any; // Optional: To help parent initialize formValue
}

// Define props
const props = defineProps({
  formValue: {
    // The form model, managed by the parent
    type: Object as () => Record<string, any>,
    required: true,
  },
  itemConfigs: {
    // Array of configurations for each filter item
    type: Array as () => FilterItemConfig[],
    required: true,
    default: () => [],
  },
  defaultVisibleItemsCount: {
    // Number of items visible by default before expanding
    type: Number,
    default: 2,
  },
  gridCols: {
    type: String,
    default: "1 s:2 m:4", // Default grid column setup
  },
  actionGiSpan: {
    // Span for the action buttons grid item
    type: Number,
    default: 1,
  },
});

// Define emits
const emit = defineEmits(["search", "reset"]);

const formRef = ref<FormInst | null>(null);
const showAllFilters = ref(false); // Changed from false to true

const itemsToDisplay = computed(() => {
  if (
    showAllFilters.value ||
    props.itemConfigs.length <= props.defaultVisibleItemsCount
  ) {
    return props.itemConfigs;
  }
  return props.itemConfigs.slice(0, props.defaultVisibleItemsCount);
});

const toggleFilters = () => {
  showAllFilters.value = !showAllFilters.value;
};

const handleSearch = () => {
  emit("search", { ...props.formValue });
};

const handleResetClick = () => {
  emit("reset"); // Parent is responsible for resetting formValue
  // Optionally, reset showAllFilters state if desired upon reset
  // showAllFilters.value = false;
};
</script>

<style scoped>
/* Add any specific styles for this component if needed */
</style>
