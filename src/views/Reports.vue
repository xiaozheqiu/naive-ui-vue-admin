<template>
  <div>
    <h2>报告</h2>
    <p>这是后台的报告页面。</p>
    <div>
      <p>当前计数：{{ count }}</p>
      <div class="flex gap-4">
        <button @click="increment">增加</button>
        <button @click="decrement">减少</button>
        <button @click="reset">重置</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}

function decrement() {
  count.value--;
}

function reset() {
  count.value = 0;
}
</script>
