<template>
  <div class="flex flex-col gap-3 h-full">
    <FilterCard
      :form-value="currentFilters"
      :item-configs="filterItemDefinitions"
      :default-visible-items-count="2"
      :action-gi-span="1"
      @search="handleSearch"
      @reset="handleReset"
    />

    <n-card
      ref="tableCardRef"
      title="菜单列表"
      :bordered="false"
      class="data-table-card"
    >
      <template #header-extra>
        <n-button type="primary" @click="handleAdd">新增菜单</n-button>
      </template>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        :style="{ height: dataTableHeight + 'px' }"
        class="flex-table px-3 pb-3"
        flex-height
        :loading="loading"
      />
    </n-card>

    <n-modal
      v-model:show="showModal"
      preset="card"
      style="width: 600px"
      :title="modalMode === 'add' ? '新增菜单' : '编辑菜单'"
      class="px-2"
    >
      <n-form
        ref="formRef"
        :model="currentEditMenu"
        :rules="rules"
        label-placement="left"
        require-mark-placement="right-hanging"
        class="pt-4"
      >
        <n-form-item label="菜单名称" path="name">
          <n-input
            v-model:value="currentEditMenu.name"
            placeholder="输入菜单名称"
          />
        </n-form-item>
        <n-form-item label="图标" path="icon">
          <n-input
            v-model:value="currentEditMenu.icon"
            placeholder="输入图标"
          />
        </n-form-item>
        <n-form-item label="排序" path="order">
          <n-input-number
            v-model:value="currentEditMenu.order"
            placeholder="输入排序"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item label="权限标识" path="permission">
          <n-input
            v-model:value="currentEditMenu.permission"
            placeholder="输入权限标识"
          />
        </n-form-item>
        <n-form-item label="组件路径" path="component">
          <n-input
            v-model:value="currentEditMenu.component"
            placeholder="输入组件路径"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="currentEditMenu.status"
            placeholder="请选择状态"
            :options="[
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ]"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="flex justify-end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSave" style="margin-left: 8px"
            >保存</n-button
          >
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, onUpdated, computed } from "vue";
import {
  NButton,
  NCard,
  NDataTable,
  NInput,
  NSelect,
  NTag,
  NModal,
  NForm,
  NFormItem,
  NInputNumber,
  type FormInst,
  type FormRules,
  type SelectOption,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import FilterCard, { type FilterItemConfig } from "@/components/FilterCard.vue";
import { useDataTableHeight } from "@/hooks/useDataTableHeight";
import { getMenus } from "@/services/menu";
import type { IMenu } from "@/services/menu/type";
import { useRequest } from "vue-hooks-plus";

const { loading, runAsync } = useRequest(getMenus, { manual: true });

// Reactive state for the actual form values
const currentFilters = reactive<Record<string, string | number>>({});

// Define the configurations for the filter items
const filterItemDefinitions = computed<FilterItemConfig[]>(() => [
  {
    path: "menuName",
    label: "菜单名称",
    giProps: { span: 1 },
    control: {
      component: NInput,
      props: { placeholder: "输入菜单名称" },
    },
    defaultValue: "",
  },
  {
    path: "status",
    label: "状态",
    control: {
      component: NSelect,
      props: {
        placeholder: "请选择状态",
        options: [
          { label: "启用", value: 1 },
          { label: "禁用", value: 0 },
        ] as SelectOption[],
      },
    },
    defaultValue: null,
  },
]);

// Initialize currentFilters based on defaultValues from filterItemDefinitions
const initializeFilters = () => {
  filterItemDefinitions.value.forEach((config) => {
    currentFilters[config.path] = config.defaultValue;
  });
};
initializeFilters();

// Modal and Form state
const showModal = ref(false);
const modalMode = ref<"add" | "edit">("add");
const formRef = ref<FormInst | null>(null);
const defaultMenuValues: Omit<IMenu, "id" | "createdAt" | "children"> = {
  name: "",
  icon: "",
  order: 0,
  permission: "",
  component: "",
  status: 1,
};
const currentEditMenu = ref<Partial<IMenu>>({ ...defaultMenuValues });

const rules: FormRules = {
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  order: [
    {
      type: "number",
      required: true,
      message: "请输入排序",
      trigger: ["blur", "input"],
    },
  ],
  status: [
    {
      type: "number",
      required: true,
      message: "请选择状态",
      trigger: "change",
    },
  ],
};

// 表格列配置
const createColumns = ({
  edit,
}: {
  edit: (rowData: IMenu) => void;
}): DataTableColumns<IMenu> => {
  return [
    {
      title: "菜单名称",
      key: "name",
      fixed: "left",
      width: 200,
    },
    {
      title: "图标",
      key: "icon",
      width: 150,
    },
    {
      title: "排序",
      key: "order",
      width: 80,
    },
    {
      title: "权限标识",
      key: "permission",
      width: 200,
    },
    {
      title: "组件路径",
      key: "component",
      width: 250,
    },
    {
      title: "状态",
      key: "status",
      width: 100,
      render(row: IMenu) {
        return h(
          NTag,
          { type: row.status === 1 ? "success" : "error" },
          { default: () => (row.status === 1 ? "启用" : "禁用") },
        );
      },
    },
    {
      title: "创建时间",
      key: "createdAt",
      width: 180,
      render: (row: IMenu) =>
        row.createdAt ? new Date(row.createdAt).toLocaleString() : "-",
    },
    {
      title: "操作",
      key: "actions",
      fixed: "right",
      width: 120,
      render(row: IMenu) {
        return [
          h(
            NButton,
            {
              size: "small",
              type: "primary",
              ghost: true,
              style: "margin-right: 6px;",
              onClick: () => edit(row),
            },
            { default: () => "编辑" },
          ),
        ];
      },
    },
  ];
};

const columns = createColumns({
  edit: (rowData) => {
    modalMode.value = "edit";
    currentEditMenu.value = { ...rowData };
    showModal.value = true;
  },
});

// 表格数据
const tableData = ref<IMenu[]>([]);

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 20,
  itemCount: 0,
  onChange: (page: number) => {
    pagination.page = page;
    fetchTableData();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    fetchTableData();
  },
});

// 获取表格数据
const fetchTableData = async () => {
  const params: Record<string, any> = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };
  Object.keys(currentFilters).forEach((key) => {
    if (
      currentFilters[key] !== null &&
      currentFilters[key] !== "" &&
      typeof currentFilters[key] !== "undefined"
    ) {
      params[key] = currentFilters[key];
    }
  });

  console.log("Fetching data with params:", params);
  try {
    const response = await runAsync(params);
    if (response) {
      tableData.value = response.list || [];
      pagination.itemCount = response.total || 0;
    } else {
      console.warn("Received null or undefined response from getMenus");
      tableData.value = [];
      pagination.itemCount = 0;
    }
  } catch (error) {
    console.error("Failed to fetch table data:", error);
    tableData.value = [];
    pagination.itemCount = 0;
  }
};

// 搜索处理
const handleSearch = () => {
  pagination.page = 1;
  fetchTableData();
};

// 重置处理
const handleReset = () => {
  initializeFilters();
  pagination.page = 1;
  fetchTableData();
};

// 新增菜单处理
const handleAdd = () => {
  modalMode.value = "add";
  currentEditMenu.value = { ...defaultMenuValues };
  showModal.value = true;
};

// 保存菜单处理
const handleSave = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      console.log("Saving menu:", currentEditMenu.value);
      if (modalMode.value === "add") {
        console.log("Simulating create menu...");
      } else {
        console.log("Simulating update menu...");
      }
      showModal.value = false;
      fetchTableData();
    } else {
      console.log("Form validation errors:", errors);
    }
  });
};

// 组件挂载时加载数据
const tableCardRef = ref<any>(null);
const { dataTableHeight, updateDataTableHeight: updateHeight } =
  useDataTableHeight(tableCardRef);

onMounted(() => {
  fetchTableData();
});

onUpdated(() => {
  updateHeight();
});
</script>

<style scoped>
.n-card__content {
  flex-grow: 1;
  overflow: hidden;
}

.data-table-card {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.data-table-card > :deep(.n-card__content) {
  flex-grow: 1;
  overflow-y: hidden;
  padding: 0 !important;
}

.flex-table > :deep(.n-data-table-wrapper) {
  height: 100%;
}

.flex-table > :deep(.n-data-table-base-table) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.flex-table > :deep(.n-data-table-base-table__body-wrapper) {
  flex-grow: 1;
  overflow-y: auto;
}
</style>
