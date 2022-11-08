<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Layout from '@/views/layout.vue'
</script>

<template>
  <Layout />
</template>

<style>
/* el-dialog 样式 */
.el-dialog {
  box-shadow: 0px -10px 30px #25a8e0;
  border: 10px solid #ddd;
  border-image: linear-gradient(#1feddf, rgba(66, 136, 182, 0)) 20 20 0 20;
}
.el-dialog__headerbtn {
  top: -4px;
}
.el-overlay {
  z-index: 999999!important;
}
</style>