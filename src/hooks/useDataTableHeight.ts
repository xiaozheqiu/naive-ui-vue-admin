import { ref, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue';

export function useDataTableHeight(tableCardRef: Ref<any>) {
  const dataTableHeight = ref(300); // Default or initial height

  const updateDataTableHeight = async () => {
    await nextTick(); // Ensure DOM is updated
    if (tableCardRef.value && tableCardRef.value.$el) {
      const cardElement = tableCardRef.value.$el as HTMLElement;
      const headerElement = cardElement.querySelector(
        ".n-card-header",
      ) as HTMLElement;

      if (headerElement) {
        const cardHeight = cardElement.clientHeight;
        const headerHeight = headerElement.offsetHeight;
        // You might want to subtract a little more for padding or margins inside the card content area
        const calculatedHeight = cardHeight - headerHeight; // Subtracting an arbitrary 20px for potential paddings
        dataTableHeight.value = Math.max(calculatedHeight, 150); // Ensure a minimum height
      } else {
        // Fallback if header is not found, or card is not yet fully rendered
        dataTableHeight.value =
          cardElement.clientHeight > 100 ? cardElement.clientHeight - 50 : 300;
      }
    } else {
      // Fallback if card ref is not available
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
