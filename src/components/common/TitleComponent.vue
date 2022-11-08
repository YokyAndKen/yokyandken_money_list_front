<script setup lang='ts'>
  import { reactive, onMounted } from 'vue'
  import { getAssetsFile } from '@/utils/getAssetsFile.ts'

const props = defineProps<{
  title: string,
  width: string,
}>()

</script>

<template>
<div class="flex flex-start flex_nowrap" style="align-items: center;" >
  <img :src="getAssetsFile('小标题.png')" alt="title" >
  <div class="subheading"  style="margin-left:5px;flex-shrink: 0;">{{props.title}}</div>
  <img :src="getAssetsFile('小标题2.png')" alt="title" class="title_img_2" :style="{ width: props.width }">
</div>
</template>

<style scoped lang='scss'>
.title_img_2 {
  height: 10px;
  margin-left:5px;
}
</style>
