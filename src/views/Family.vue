<template>
  <div>
    <h2>概览</h2>
    <p>这是后台的概览页面。</p>
    <n-date-picker />
    <HelloWorld msg="Vite + Vue" />
    <h1>{{ t("welcome") }}</h1>
    <button @click="setLanguage('en')">English</button>
    <button @click="setLanguage('zh')">中文</button>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useSystemStore } from "../store/system";
const { t } = useI18n();
const { setLanguage } = useSystemStore();
</script>
