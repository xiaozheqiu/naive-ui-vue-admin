import { ref, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue';

export function useDataTableHeight(tableCardRef: Ref<HTMLElement | null>) {
  const dataTableHeight = ref(300); // Default or initial height

  const updateDataTableHeight = async () => {
    await nextTick(); // Ensure DOM is updated
    if (tableCardRef.value) {
      const cardElement = tableCardRef.value;
      // 支持 ant-design-vue 的类名
      const headerElement = cardElement.querySelector(
        ".ant-card-head",
      ) as HTMLElement;

      if (headerElement) {
        const cardHeight = cardElement.clientHeight;
        const headerHeight = headerElement.offsetHeight;
        // 根据 ant-design-vue 的结构计算表格高度
        const calculatedHeight = cardHeight - headerHeight - 40; // 减去一些内边距和其他元素的高度
        dataTableHeight.value = Math.max(calculatedHeight, 200); // 确保最小高度
      } else {
        // 若找不到头部元素，使用备用计算方法
        dataTableHeight.value =
          cardElement.clientHeight > 100 ? cardElement.clientHeight - 50 : 300;
      }
    } else {
      // 若引用不可用，使用默认高度
      dataTableHeight.value = 300;
    }
  };

  onMounted(() => {
    updateDataTableHeight();
    window.addEventListener('resize', updateDataTableHeight);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateDataTableHeight);
  });

  // Watch for changes that might affect layout and recalculate
  // This might be needed if the content of the card changes dynamically
  // For example, if new elements are added or removed from the card header
  // You might need to call updateDataTableHeight manually in such cases or use a ResizeObserver

  return { dataTableHeight, updateDataTableHeight };
}
