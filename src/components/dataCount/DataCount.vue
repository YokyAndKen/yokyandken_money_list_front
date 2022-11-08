<template>
  <div class="dataItem flex-wrap" >
    <div class="flex flex-space-between flex-wrap">
      <div class="first_item flex flex-space-between">
        <img :src="getAssetsFile('概念本体.png')" alt="title" >
        <div><div class="gradient_number">{{props.homeStatistics.conceptNoumenonNumber}}</div><div class="normal_word">概念本体</div></div>
      </div>
      <div class="first_item flex flex-space-between">
        <img :src="getAssetsFile('实体.png')" alt="title" >
        <div style="text-align: end;"><div class="gradient_number">{{props.homeStatistics.entityNumber}}</div><div class="normal_word">实体数</div></div>
      </div>
    </div>

    <div class="flex flex-space-between" style=" margin-top: 35px;">
      <div class="first_item flex flex-space-between">
        <img :src="getAssetsFile('关系类型.png')" alt="title" >
        <div><div class="gradient_number">{{props.homeStatistics.relationTypeNumber}}</div><div class="normal_word">关系类型</div></div>
      </div>
      <div class="first_item flex flex-space-between" >
        <img :src="getAssetsFile('关系类型.png')" alt="title" >
        <div style="text-align: end;"><div class="gradient_number">{{props.homeStatistics.relationNumber}}</div><div class="normal_word">关系数</div></div>
      </div>
    </div>
  </div>

  <div class="dataItem">
    <div class="flex flex-space-between second_item">
        <img :src="getAssetsFile('报告总数.png')" alt="title">
        <div><div class="gradient_number">{{props.homeStatistics.reportNumber}}</div><div class="normal_word">报告总数</div></div>
    </div>
    <div class="flex flex-space-between second_item">
        <img :src="getAssetsFile('现象.png')" alt="title" >
        <div><div class="gradient_number">{{props.homeStatistics.faultPhenomenonNumber}}</div><div class="normal_word">故障现象总数</div></div>
    </div>
    <div class="flex flex-space-between second_item">
        <img :src="getAssetsFile('故障原因.png')" alt="title" >
        <div><div class="gradient_number">{{props.homeStatistics.faultReasonNumber}}</div><div class="normal_word">故障原因总数</div></div>
    </div>
  </div>

  <div class="dataItem">
        <div class="flex flex-space-between second_item">
        <img :src="getAssetsFile('星.png')" alt="title">
        <div><div class="gradient_number">{{props.homeStatistics.satelliteNumber}}</div><div class="normal_word">星总数</div></div>
    </div>
    <div class="flex flex-space-between second_item">
        <img :src="getAssetsFile('分系统.png')" alt="title" >
        <div><div class="gradient_number">{{props.homeStatistics.subsystemNumber}}</div><div class="normal_word">分系统总数</div></div>
    </div>
    <div class="flex flex-space-between second_item">
        <img :src="getAssetsFile('设备.png')" alt="title">
        <div><div class="gradient_number">{{props.homeStatistics.equipmentNumber}}</div><div class="normal_word">设备总数</div></div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { reactive, onMounted, defineProps } from 'vue'
import { getAssetsFile } from '@/utils/getAssetsFile.ts'

const props = defineProps({
  homeStatistics: {
    type:Object, 
    default:() => {}
  }
})

onMounted(() => {
})  

</script>



<style scoped lang='scss'>
.dataItem {
  // margin-top: 15px;
  background: rgba(9, 17, 30, 0.8000);
  width: 30%;
  // height: 90%;
  // padding: 10px;
  min-width: 180px;
}
.first_item {
  margin-top: 10px;
  width: 50%;
  // margin-left: -15px;
}
img {
  height: 40px;
  width: 40px;
}
.second_item {
  width: 100%; 
  // height: 30%;
  margin-top: 5px;
}
</style>