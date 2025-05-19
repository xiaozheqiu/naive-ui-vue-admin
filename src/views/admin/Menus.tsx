import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import FilterCard from "@/components/FilterCard.vue";
import {
  Card,
  Input,
  Select,
  Button,
  Modal,
  Form,
  Switch,
  InputNumber,
  message,
  Table,
  Tag,
} from "ant-design-vue";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { useRequest } from "vue-hooks-plus";
import { createMenu, deleteMenus, getMenus } from "@/services/menu";
import type { IMenu, IGetMenuParams } from "@/services/menu/type";
import type { FormInstance, Rule } from "ant-design-vue/es/form";
import http from "@/tools/axios";
import SelectIcon from "@/components/SelectIcon/index.vue";
import CustomIcon from "@/components/CustomIcon.vue";

export default defineComponent({
  components: {
    FilterCard,
    Card,
    Input,
    Select,
    Button,
    Modal,
    Form,
    Switch,
    InputNumber,
    Table,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
  },
  setup() {
    const initMenuFormValue = {
      page: 1,
      pageSize: 10,
      menuName: "",
      status: undefined,
    };
    // 定义筛选表单数据
    const filterForm = reactive<IGetMenuParams>(initMenuFormValue);

    // 表单校验规则
    const rules: Record<string, Rule[]> = {
      name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
      type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
      path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
    };

    const typeMap: Record<string, { label: string; color: string }> = {
      directory: { label: "目录", color: "blue" },
      menu: { label: "菜单", color: "green" },
      button: { label: "按钮", color: "orange" },
    };

    // 表单实例引用
    const formRef = ref<FormInstance>();
    const menuForm = reactive<IMenu>({});
    const modalVisible = ref(false);
    const editingMenu = ref<IMenu | null>(null);

    const { data, loading, run, refresh } = useRequest(
      (params: IGetMenuParams) => getMenus(params),
      {
        defaultParams: [filterForm],
        manual: false,
        onSuccess: (res) => {
          console.log("请求成功", res);
        },
      },
    );

    const { run: createMenuRequest, loading: createMenuLoading } = useRequest(
      createMenu,
      {
        manual: true,
        onSuccess: () => {
          message.success("菜单创建成功");
          closeModal();
          refresh();
        },
      },
    );

    const { run: updateMenuRequest, loading: updateMenuLoading } = useRequest(
      (menu: IMenu) => {
        if (!menu.id) {
          throw new Error("菜单 ID 不能为空");
        }
        return http.put(`/admin/menus/${menu.id}`, menu);
      },
      {
        manual: true,
        onSuccess: () => {
          message.success("菜单更新成功");
          closeModal();
          refresh();
        },
      },
    );

    // 计算可选的上级菜单
    function findDescendantIds(menu: IMenu, result: Set<number>) {
      if (menu.children && menu.children.length) {
        for (const child of menu.children) {
          if (child.id) {
            result.add(child.id);
            findDescendantIds(child, result);
          }
        }
      }
    }

    const menuOptions = computed(() => {
      if (!editingMenu.value) return data.value || [];

      const excludeIds = new Set<number>();
      excludeIds.add(editingMenu?.value?.id);
      findDescendantIds(editingMenu.value, excludeIds);

      function filterMenus(menus: IMenu[]): IMenu[] {
        return menus
          .filter((menu) => !excludeIds.has(menu?.id))
          .map((menu) => ({
            ...menu,
            children: menu.children ? filterMenus(menu.children) : [],
          }));
      }

      return filterMenus(data.value || []);
    });

    console.log("menuOptions", menuOptions.value);

    const columns = [
      {
        title: "菜单名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "图标",
        dataIndex: "icon",
        key: "icon",
        align: "center",
        customRender: ({ text }: { text: string }) => {
          return text ? <CustomIcon name={text} isOnlyIcon /> : "-";
        },
      },
      {
        title: "类型",
        dataIndex: "type",
        key: "type",
        align: "center",
        customRender: ({ text }: { text: string }) => {
          const info = typeMap[text] || { label: text, color: "default" };
          return <Tag color={info.color}>{info.label}</Tag>;
        },
      },
      {
        title: "路径",
        dataIndex: "path",
        key: "path",
        customRender: ({ text }: { text: number }) => {
          return text || "-";
        },
      },
      {
        title: "权限标识",
        dataIndex: "permission",
        key: "permission",
        customRender: ({ text }: { text: number }) => {
          return text || "-";
        },
      },
      {
        title: "排序",
        dataIndex: "orderNo",
        key: "orderNo",
        align: "center",
        customRender: ({ text }: { text: number }) => {
          return text || "-";
        },
      },
      {
        title: "状态",
        dataIndex: "show",
        key: "show",
        align: "center",
        customRender: ({ text }: { text: boolean }) => {
          return text ? (
            <Tag color="success">显示</Tag>
          ) : (
            <Tag color="error">隐藏</Tag>
          );
        },
      },
      {
        title: "操作",
        key: "action",
        width: 200,
        align: "center",
        customRender: ({ record }: { record: IMenu }) => {
          return (
            <div class="flex gap-2 justify-center">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditMenu(record)}
              >
                编辑
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteMenu(record)}
              >
                删除
              </Button>
            </div>
          );
        },
      },
    ];
    // ...existing code...

    // 处理分页变化
    const handlePageChange = (page: number, pageSize: number) => {
      filterForm.page = page;
      filterForm.pageSize = pageSize;
      run(filterForm);
    };

    // 处理搜索事件
    const handleSearch = (values: any) => {
      filterForm.page = 1; // 重置为第一页
      filterForm.menuName = values.keyword;
      filterForm.status = values.status;
      run(filterForm);
    };

    // 处理重置事件
    const handleReset = () => {
      filterForm.page = 1;
      filterForm.pageSize = 10;
      filterForm.menuName = "";
      filterForm.status = undefined;
      run(filterForm);
    };

    // 添加菜单
    const handleAddMenu = () => {
      Object.assign(menuForm, {});
      editingMenu.value = null;
      modalVisible.value = true;
    };

    // 编辑菜单
    const handleEditMenu = (record: IMenu) => {
      editingMenu.value = record;
      Object.assign(menuForm, record);
      modalVisible.value = true;
    };

    // 删除菜单
    const handleDeleteMenu = async (record: IMenu) => {
      if (!record.id) {
        message.error("菜单 ID 不能为空");
        return;
      }
      Modal.confirm({
        title: "确认删除",
        content: `确定要删除菜单 "${record.name}" 吗？`,
        okText: "删除",
        cancelText: "取消",
        onOk: async () => {
          try {
            await deleteMenus(record.id as number);
            message.success("删除成功");
            refresh(); // 刷新列表
          } catch {}
        },
      });
    };

    // 提交表单
    const handleSubmit = async () => {
      try {
        await formRef.value?.validate();
        if (editingMenu.value) {
          updateMenuRequest(menuForm);
        } else {
          createMenuRequest(menuForm);
        }
      } catch {}
    };

    // 关闭弹窗
    const closeModal = () => {
      modalVisible.value = false;
      formRef.value?.resetFields();
      editingMenu.value = null;
    };

    // 组件挂载时初始化数据
    onMounted(() => {
      run(filterForm);
    });

    return {
      filterForm,
      data,
      loading,
      columns,
      menuForm,
      modalVisible,
      editingMenu,
      menuOptions,
      formRef,
      rules,
      handlePageChange,
      handleSearch,
      handleReset,
      handleAddMenu,
      handleEditMenu,
      handleDeleteMenu,
      handleSubmit,
      closeModal,
      updateMenuLoading,
      createMenuLoading,
    };
  },
  render() {
    return (
      <div class="flex h-full gap-4 flex-col">
        <FilterCard
          formValue={this.filterForm}
          itemConfigs={[]}
          defaultVisibleItemsCount={2}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />

        <Card class="flex flex-col gap-3 h-full">
          <div class="flex justify-between items-center mb-2">
            <div class="font-medium">菜单列表</div>
            <Button type="primary" onClick={this.handleAddMenu}>
              <PlusOutlined />
              新建菜单
            </Button>
          </div>
          <Table
            dataSource={this.data || []}
            columns={this.columns}
            loading={this.loading}
            class="custom-table"
            pagination={false}
          />
        </Card>

        <Modal
          v-model:open={this.modalVisible}
          title={this.editingMenu ? "编辑菜单" : "新建菜单"}
          maskClosable={false}
          onOk={this.handleSubmit}
          onCancel={this.closeModal}
          confirmLoading={this.updateMenuLoading || this.createMenuLoading}
          centered
        >
          <Form
            ref="formRef"
            model={this.menuForm}
            rules={this.rules}
            layout="vertical"
            class="!mt-4"
          >
            <div class="flex gap-2">
              <Form.Item name="name" label="菜单名称" class="flex-1">
                <Input
                  v-model:value={this.menuForm.name}
                  placeholder="请输入菜单名称"
                />
              </Form.Item>
              <Form.Item name="parentId" label="上级菜单" class="flex-1">
                <Select
                  v-model:value={this.menuForm.parentId}
                  placeholder="请选择上级菜单"
                  allowClear
                >
                  {this.menuOptions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div class="flex gap-2">
              <Form.Item name="type" label="菜单类型" class="flex-1">
                <Select
                  v-model:value={this.menuForm.type}
                  placeholder="请选择菜单类型"
                >
                  <Select.Option value="directory">目录</Select.Option>
                  <Select.Option value="menu">菜单</Select.Option>
                  <Select.Option value="button">按钮</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="orderNo" label="排序" class="flex-1">
                <InputNumber
                  v-model:value={this.menuForm.orderNo}
                  placeholder="请输入排序"
                  class="!w-full"
                />
              </Form.Item>
            </div>
            <div class="flex gap-2">
              <Form.Item name="path" label="路由地址" class="flex-1">
                <Input
                  v-model:value={this.menuForm.path}
                  placeholder="请输入路由地址"
                />
              </Form.Item>
              <Form.Item name="permission" label="权限标识" class="flex-1">
                <Input
                  v-model:value={this.menuForm.permission}
                  placeholder="请输入权限标识"
                />
              </Form.Item>
            </div>

            <div class="flex gap-2">
              <Form.Item name="show" label="是否显示" class="flex-1">
                <Switch v-model:checked={this.menuForm.show} />
              </Form.Item>
              <Form.Item name="show" label="是否显示" class="flex-1">
                <SelectIcon v-model:value={this.menuForm.icon} />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    );
  },
});
