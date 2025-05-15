<template>
  <div class="flex flex-col gap-4 p-4">
    <a-form ref="formRef" :model="props.formValue" layout="horizontal">
      <a-row :gutter="[16, 12]">
        <template v-for="config in itemsToDisplay" :key="config.path">
          <a-col v-bind="config.colProps || getDefaultColProps()">
            <a-form-item
              :label="config.label"
              :name="config.path"
              v-bind="config.formItemProps || {}"
              :validate-status="undefined"
              :help="undefined"
              class="tailwind-form-item"
            >
              <component
                :is="config.control.component"
                v-model:value="props.formValue[config.path]"
                v-bind="config.control.props || {}"
                class="rounded-md"
              />
            </a-form-item>
          </a-col>
        </template>

        <a-col :span="props.actionColSpan || 6">
          <a-space class="flex items-center h-full mt-1">
            <a-button
              type="primary"
              @click="handleSearch"
              class="inline-flex items-center rounded-md"
            >
              <template #icon><SearchOutlined /></template>
              搜索
            </a-button>
            <a-button
              @click="handleResetClick"
              class="inline-flex items-center rounded-md"
            >
              <template #icon><ReloadOutlined /></template>
              重置
            </a-button>
            <a-button
              type="link"
              @click="toggleFilters"
              v-if="props.itemConfigs.length > props.defaultVisibleItemsCount"
              class="inline-flex items-center p-1"
            >
              <template #icon>
                <UpOutlined v-if="showAllFilters" />
                <DownOutlined v-else />
              </template>
              {{ showAllFilters ? "收起" : "展开" }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps, type Component } from "vue";
import {
  Button as AButton,
  Card as ACard,
  Form as AForm,
  FormItem as AFormItem,
  Row as ARow,
  Col as ACol,
  Space as ASpace,
  Input as AInput,
} from "ant-design-vue";
import type { FormInstance, FormItemProps } from "ant-design-vue";
import {
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import CustomIcon from "@/components/CustomIcon.vue";

interface FormItemControlConfig {
  component: string | Component; // e.g., 'AInput', 'ASelect', or imported component object
  props?: Record<string, any>; // Props for the control itself
}

export interface FilterItemConfig {
  // Exporting for use in parent component
  path: string; // Used for formValue key and n-form-item path
  label: string;
  colProps?: Record<string, any>; // Props for a-col, e.g., { span: 6 }
  formItemProps?: Omit<FormItemProps, "label" | "name">; // Additional props for a-form-item
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
  // 将原来的 gridCols 改为更符合 antd 的属性
  responsiveCol: {
    type: Boolean,
    default: true,
  },
  actionColSpan: {
    // Span for the action buttons grid item
    type: Number,
    default: 6,
  },
});

// Define emits
const emit = defineEmits(["search", "reset"]);

const formRef = ref<FormInstance>();
const showAllFilters = ref(false);

// 根据是否响应式来获取默认的列配置
const getDefaultColProps = () => {
  if (props.responsiveCol) {
    return {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6,
    };
  }
  return { span: 6 };
};

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
/* 只保留必要的组件特定样式覆盖 */
:deep(.ant-form-item) {
  margin-bottom: 0;
}

:deep(.ant-form-item-label) {
  padding-bottom: 0;
}

:deep(.ant-form-item-control-input) {
  min-height: 32px;
}

:deep(.ant-btn .anticon) {
  margin-right: 4px;
}

/* 覆盖卡片内边距 */
:deep(.ant-card-body) {
  padding: 0;
}

/* 圆角选择器 */
:deep(.ant-select-selector) {
  border-radius: 0.375rem;
}

/* 自定义表单标签样式 */
:deep(.tailwind-form-item .ant-form-item-label > label) {
  color: #374151;
}
</style>
