<template>
  <div >
    <!-- 使用FilterCard组件 -->
    <FilterCard
      :formValue="filterForm"
      :itemConfigs="filterConfig"
      :defaultVisibleItemsCount="2"
      @search="handleSearch"
      @reset="handleReset"
    />

    <!-- 显示筛选结果 -->
    <div class="mt-4 bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg font-medium mb-2">筛选结果</h2>
      <pre class="bg-gray-50 p-2 rounded">{{
        JSON.stringify(searchParams, null, 2)
      }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import FilterCard, { type FilterItemConfig } from "@/components/FilterCard.vue";
import { Input, Select, DatePicker, TimePicker } from "ant-design-vue";

// 定义筛选表单数据
const filterForm = reactive({
  keyword: "",
  status: undefined,
  category: undefined,
  dateRange: [],
  createTime: null,
});

// 定义搜索参数(用于展示搜索结果)
const searchParams = ref({});

// 定义筛选配置
const filterConfig: FilterItemConfig[] = [
  {
    path: "keyword",
    label: "关键词",
    control: {
      component: Input,
      props: {
        placeholder: "请输入关键词",
        allowClear: true,
      },
    },
  },
  {
    path: "status",
    label: "状态",
    control: {
      component: Select,
      props: {
        placeholder: "请选择状态",
        allowClear: true,
        options: [
          { value: 1, label: "已启用" },
          { value: 0, label: "已禁用" },
        ],
      },
    },
  },
  {
    path: "category",
    label: "分类",
    control: {
      component: Select,
      props: {
        placeholder: "请选择分类",
        allowClear: true,
        options: [
          { value: "tech", label: "科技" },
          { value: "finance", label: "金融" },
          { value: "education", label: "教育" },
          { value: "health", label: "健康" },
        ],
      },
    },
  },
  {
    path: "dateRange",
    label: "日期范围",
    control: {
      component: DatePicker.RangePicker,
      props: {
        placeholder: ["开始日期", "结束日期"],
        style: { width: "100%" },
      },
    },
  },
  {
    path: "createTime",
    label: "创建时间",
    control: {
      component: TimePicker,
      props: {
        placeholder: "请选择时间",
        format: "HH:mm",
        style: { width: "100%" },
      },
    },
  },
];

// 处理搜索事件
const handleSearch = (values: any) => {
  console.log("搜索参数:", values);
  searchParams.value = values;
  // 这里可以调用API进行实际搜索
};

// 处理重置事件
const handleReset = () => {
  // 重置表单数据
  Object.keys(filterForm).forEach((key) => {
    filterForm[key] = Array.isArray(filterForm[key]) ? [] : undefined;
  });
  filterForm.keyword = "";

  searchParams.value = {};
  console.log("表单已重置");
};
</script>
