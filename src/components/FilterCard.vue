<template>
  <Card>
    <Form ref="formRef" :model="props.formValue" layout="horizontal">
      <Row :gutter="[16, 12]">
        <template v-for="config in itemsToDisplay" :key="config.path">
          <Col :span="props.colSpan">
            <FormItem
              :label="config.label"
              :name="config.path"
              v-bind="config.formItemProps || {}"
              class="!mb-0"
            >
              <component
                :is="config.control.component"
                v-model:value="props.formValue[config.path]"
                v-bind="config.control.props || {}"
                class="w-full rounded-md"
              />
            </FormItem>
          </Col>
        </template>

        <Col :span="props.colSpan">
          <Space class="flex items-center">
            <Button type="primary" @click="handleSearch">
              <template #icon><SearchOutlined /></template>
              搜索
            </Button>
            <Button @click="handleResetClick">
              <template #icon><ReloadOutlined /></template>
              重置
            </Button>
            <div
              @click="toggleFilters"
              v-if="props.itemConfigs.length > props.defaultVisibleItemsCount"
              class="flex items-center cursor-pointer justify-center gap-0.5 hover:text-blue-500"
            >
              {{ showAllFilters ? "收起" : "展开" }}
              <CustomIcon
                :name="showAllFilters ? 'LucideChevronUp' : 'LucideChevronDown'"
                :size="16"
                is-only-icon
              />
            </div>
          </Space>
        </Col>
      </Row>
    </Form>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Button, Form, FormItem, Row, Col, Space, Card } from "ant-design-vue";
import type { FormInstance, FormItemProps } from "ant-design-vue";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import CustomIcon from "@/components/CustomIcon.vue";

// 表单控件配置接口
interface FormItemControlConfig {
  component: any; // 控件组件，如 Input, Select 等
  props?: Record<string, any>; // 控件属性
}

// 筛选项配置接口
export interface FilterItemConfig {
  path: string; // 表单数据字段名
  label: string; // 表单项标签
  colProps?: Record<string, any>; // Col组件的属性
  formItemProps?: Omit<FormItemProps, "label" | "name">; // Form.Item的额外属性
  control: FormItemControlConfig; // 控件配置
  defaultValue?: any; // 可选：帮助父组件初始化表单数据
}

// 使用TypeScript语法定义props
interface Props {
  formValue: Record<string, any>; // 表单数据，由父组件管理
  itemConfigs: FilterItemConfig[]; // 筛选项配置数组
  defaultVisibleItemsCount?: number; // 默认展示的筛选项数量
  responsiveCol?: boolean; // 是否使用响应式布局
  colSpan?: number; // 每个筛选项的默认列宽
}

const props = withDefaults(defineProps<Props>(), {
  itemConfigs: () => [],
  defaultVisibleItemsCount: 2,
  responsiveCol: true,
  colSpan: 8, // 默认列宽为8
});

// 定义事件
const emit = defineEmits<{
  (e: "search", values: Record<string, any>): void;
  (e: "reset"): void;
}>();

const formRef = ref<FormInstance>();
const showAllFilters = ref(false);

// 计算需要显示的筛选项
const itemsToDisplay = computed(() => {
  if (
    showAllFilters.value ||
    props.itemConfigs.length <= props.defaultVisibleItemsCount
  ) {
    return props.itemConfigs;
  }
  return props.itemConfigs.slice(0, props.defaultVisibleItemsCount);
});

// 切换展开/收起状态
const toggleFilters = () => {
  showAllFilters.value = !showAllFilters.value;
};

// 处理搜索事件
const handleSearch = () => {
  emit("search", { ...props.formValue });
};

// 处理重置事件
const handleResetClick = () => {
  emit("reset"); // 父组件负责重置表单数据
};
</script>
