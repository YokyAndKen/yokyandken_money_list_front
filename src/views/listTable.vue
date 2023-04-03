<template>
  <div>
    概览
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue";
import detail from '@/views/table.json'

</script>




<style scoped lang='scss'>
.org_table {
  width: 800px;
  margin: 0 auto;
  background: #fff;height: 800px;overflow-y: scroll;
}
.table_title {
  margin-top: 20px;margin-bottom: 20px;
  font-size: 28px;font-weight: bold;
  width: 100%;text-align: center;
}
.pic_warpper_container {
  height: 200px;
  border: 1px solid #000;border-bottom: 0px;border-left: 0px;
}
.photo {
  width: 150px;border-bottom: 1px solid #000;
}
.line {
  border-bottom: 1px solid #000;border-left: 1px solid #000;
  height: 49px;
}
.name {
  width: 60px;height: 100%;display: flex;
  font-size: 18px;line-height: 24px;text-align: center;
  margin: auto 0;align-items: center;justify-content: center;
}
.name1 {
  width: 100px;height: 100%;display: inline-block;
  font-size: 18px;line-height: 24px;text-align: center;
}
.unit {
  border-right: 1px solid #000;border-left: 1px solid #000;height: 100%;padding-left: 3px;
  display: flex;font-size: 18px;align-items: center;line-height: 24px;
}
.name_left_container{
  border-left: 1px solid #000;
}
.page2_line {
  height: 40px;display: flex;justify-content: center;align-items: center;font-size: 18px;
}
.page2_name {
  height: 40px;display: flex;justify-content: center;align-items: center;font-size: 18px;
  width: 130px;
}
.page3_title {
  height: 49px;display: flex;justify-content: center;align-items: center;font-size: 20px;
}
.page3_content {
  min-height: 1180px;font-size: 18px;line-height: 24px;padding-left: 3px;
}
.lastpage_title {
  height: 60px;display: flex;justify-content: center;align-items: center;font-size: 24px;
}
.lastpage_word {
  height: 40px;font-size: 20px;
}

.bdl1{
  border-left: 1px solid #000;
}

.bdr1{
  border-right: 1px solid #000;
}

.bdt1{
  border-top: 1px solid #000;
}

.bdb1{
  border-bottom: 1px solid #000;
}
</style>