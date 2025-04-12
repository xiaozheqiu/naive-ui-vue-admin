<template>
  <div>
    <h1>Sub Overview</h1>
    <p>Welcome to the Sub Overview page!</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const message = ref("This is the Sub Overview page.");
</script>

<style scoped>
h1 {
  color: #333;
}

p {
  font-size: 16px;
  color: #666;
}
</style>
