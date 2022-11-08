<template>
  <el-dialog
    v-model="state.dialogVisible"
    title="故障预警"
    width="70%"
    class="warningDialog"
    :before-close="sendCloseDialog"
    :show-close="false"
  >
    <div class="content">
      <div class="content_left">
        <p class="subheading">预警列表</p>
        <ul>
          <div>
            <span style="flex:10%;">序号</span>
            <span style="flex:40%;">预警时间</span>
            <span style="flex:50%;">现象描述</span>
          </div>
          <li v-for="(item,index) in state.warnList" class="cup liFontSize" @click="selectWarning(index,item.warningId)" :class="state.highlight === index ? 'highlight':''">
            <span style="flex:10%;">{{index + 1}}</span>
            <span style="flex:40%;" class="p_ellipsis">{{ item.warningDate }} {{ item.warningTime }}</span>
            <span style="flex:50%;" class="p_ellipsis">{{ item.warningPhenomenon }}</span>
          </li>
        </ul>
        <div style="width:100%" class="flex flex-end">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="state.warnPages.pageNum"
            :page-size="state.warnPages.pageSize"
            layout="total, prev, pager, next"
            :pager-count=5
            :total="state.warnPages.total">
          </el-pagination>
        </div>
        
      </div>
      <div class="content_right" v-if="state.warnDetail">
        <p class="subheading">预警详情</p>
        <div class="content_right_detail">
          <p class="warningTimer"><span class="warnTitle">预警时间：</span><span class="warnContent">{{ state.warnDetail.warningDate }} {{state.warnDetail.warningDetailTime}}</span></p>
         <!-- <p class="warningTimer"><span class="warnTitle">预警时间：</span><span class="warnContent">2018-11-03 19:23:23</span></p> -->
         <!-- <p class="warningTimer"><span class="warnTitle">预警时间：</span><span class="warnContent">2018-11-03 19:23:23</span></p> -->
          <div>
            <p class="warnTitle bold">现象分析；</p>
            <div class="flex flex_warp flex-space-between">
              <div class="mybox flex f-48" style="margin-right:2%;">
                <img :src="getAssetsFile('icon_star.png')" alt="" class="img-62">
                <div style="margin: auto 0;">
                  <p class="warnContent">对象</p>  
                  <p class="green_color">{{ state.warnDetail.equipmentName }}</p>
                </div>
              </div>
              <div class="mybox flex f-48">
                <img :src="getAssetsFile('icon_why.png')" alt="" class="img-62">
                <div style="margin: auto 0;">
                  <p class="warnContent">现象</p>  
                  <p class="green_color">{{ state.warnDetail.warningPhenomenon }}</p>
                </div>
              </div>
              <div class="mybox flex f-100">
                <img :src="getAssetsFile('icon_var.png')" alt="" class="img-62">
                <div style="margin: auto 0;">
                  <p class="warnContent">参数及约束</p>  
                  <p class="green_color">{{ state.warnDetail.paramsName }} / 阈值：[{{ state.warnDetail.thresholdMin }} , {{ state.warnDetail.thresholdMax }}]</p>
                </div>
              </div>
              <div class="echart mybox f-100">
                <Echart echartType="line" :echartData="state.echartData"></Echart>
              </div>
            </div>
          </div>
          <div style="margin-top:8px;">
            <p class="flex flex-space-between">
              <span class="warnTitle  bold">故障预测：</span>
              <span @click="faultDiagnose" style="color:#17C1D4;" class="cup">进行故障诊断<img :src="getAssetsFile('icon_turn-left.png')" alt=""></span>
            </p>
            <div class="flex flex_warp flex-space-between">
              <div class="mybox flex f-30" style="margin-right:2%;">
                <img :src="getAssetsFile('icon_star.png')" alt="" class="img-62">
                <div style="margin: auto 0;">
                  <p class="warnContent">星</p>  
                  <p class="green_color">{{ state.warnDetail.satelliteName }}</p>
                </div>
              </div>
              <div class="mybox flex f-30" style="margin-right:2%;">
                <img :src="getAssetsFile('icon_shebei.png')" alt="" class="img-62">
                <div style="margin: auto 0;">
                  <p class="warnContent">设备</p>  
                  <p class="green_color">{{ state.warnDetail.equipmentName }}</p>
                </div>
              </div>
              <div class="mybox flex f-30">
                <img :src="getAssetsFile('icon_system.png')" alt="" class="img-62">
                <div style="margin: auto 0;">
                  <p class="warnContent">分系统</p>  
                  <p class="green_color">{{ state.warnDetail.subsystemName }}</p>
                </div>
              </div>
              <div class="mybox flex f-100">
                <img :src="getAssetsFile('icon_system.png')" alt="" class="img-62">
                <div style="margin: auto 0;">
                  <p class="warnContent">故障现象</p>  
                  <p class="green_color">{{ state.warnDetail.warningPhenomenon }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from 'vue'
import { getAssetsFile } from '@/utils/getAssetsFile.ts'
import Echart from './Echart.vue'
import { earlyWarning, earlyWarningDetail } from '@/api'
import {useRouter} from "vue-router";
const router = useRouter()
const emits = defineEmits('sendCloseDialog')
const state = reactive({
  dialogVisible: true,
  highlight:0,
  warnPages:{
    pageNum: 1,
    pageSize: 10,
    total:100
  },
  echartData:{},
  warnList: [],
  warnDetail: null
})

const sendCloseDialog = () => {
  state.dialogVisible = true
  emits('sendCloseDialog',false)
}

const selectWarning = async (index:number, id:any) => {
  state.highlight = index
  await getEarlyWarningDetail(id)
}

const faultDiagnose = () => {
  if(!state.warnDetail) return
  sendCloseDialog()
  router.push(`/trouble?searchKey=${state.warnDetail.warningPhenomenon}`)
}

const getList = async () =>{
  const res = await earlyWarning['query/page'](state.warnPages.pageNum,state.warnPages.pageSize)
  state.warnList  = res.data.data.records
  state.warnPages.total = res.data.data.totalCount
}

const handleSizeChange = (pageSize:any) => {
  // console.log(pageSize);
  state.warnPages.pageSize = pageSize
  getList()
}
const handleCurrentChange = (pageNum:any) => {
  state.warnPages.pageNum = pageNum
  getList()
  
}

const getEarlyWarningDetail = async (id:any) =>{
  const res = await earlyWarningDetail['queryByWarningId'](id)
  state.warnDetail = res.data.data
  nextTick(()=>{
    state.echartData = {
      xAxis: JSON.parse(state.warnDetail.warningTimePoints),
      // xAxis: ['00:27:00', '00:29:00', '00:31:00', '00:33:00', '00:35:00', '00:37:00', '00:39:00', '00:41:00', '00:43:00', '00:45:00', '00:47:00', '00:49:00', '00:51:00', '00:53:00', '00:55:00', '00:57:00', '00:59:00', '01:01:00', '01:03:00', '01:05:00'],
      yAxis: {
        '1': JSON.parse(state.warnDetail.warningPoints),
      },
      datumLine:{
        max:state.warnDetail.thresholdMax,
        min:state.warnDetail.thresholdMin,
      }
    }
  })
}
onMounted(async ()=>{
  await getList()
  selectWarning(0,state.warnList[0].warningId)
})
</script>

<style scoped lang="scss">
.content{
  display: flex;
  .content_left {
    width: 45%;
    ul {
      overflow: hidden;
      width: 100%;
      height: 530px;
      margin-top: 10px;
      div {
        display: flex;
        width: 100%;
        height: 34px;
        background: #0D2133;
        line-height: 34px;
        border: 1px solid rgba($color: #000000, $alpha: 0);
        padding: 0 10px;
        margin-top: 4px;
      }
      li {
        display: flex;
        width: 100%;
        height: 34px;
        background: #0D2133;
        line-height: 34px;
        border: 1px solid rgba($color: #000000, $alpha: 0);
        padding: 0 10px;
        margin-top: 4px;
        &:hover {
          background: linear-gradient(90deg, #0A1627 0%, #214167 47%, #0A1627 100%);
          border-radius: 0px 0px 0px 0px;
          border: 1px solid;
          border-image: linear-gradient(270deg, rgba(23, 193, 212, 0), rgba(23, 193, 212, 1), rgba(23, 193, 212, 1), rgba(23, 193, 212, 0)) 1 1;
        }
      }
      .highlight {
        background: linear-gradient(90deg, #0A1627 0%, #214167 47%, #0A1627 100%);
        border-radius: 0px 0px 0px 0px;
        border: 1px solid;
        border-image: linear-gradient(270deg, rgba(23, 193, 212, 0), rgba(23, 193, 212, 1), rgba(23, 193, 212, 1), rgba(23, 193, 212, 0)) 1 1;
      }
    }
  }
  .content_right {
    width: 55%;
    margin-left: 10px;
    // padding: ;
    .content_right_detail {
      margin-top: 15px;
      height: 550px;
      padding: 8px;
      background-color: rgba(49,93,128,0.2);
      .warningTimer{
        height: 30px;
      }
      .echart {
        height: 150px;
      }
    }
  }

  .warnTitle {
    height: 20px;
    color: #FFFFFF;
    line-height: 16px;
  }
  .warnContent {
    height: 22px;
    color: #C7DCEF;
    line-height: 22px;
    font-size: 14px;
  }
  .bold {
    font-weight: bold;
  }
  .mybox {
    margin: 5px 0;
    height: 62px;
    background: rgba(9,17,30,0.8);
    border-radius: 2px 2px 2px 2px;
  }
  .green_color {
    font-size: 14px;
    font-weight: bold;
    color: #2ACFE2;
    margin-top: 3px;
  }
  .f-100 {
    flex: 100%;
  }
  .f-48 {
    flex: 48%;
  }
  .f-30 {
    flex: 30%;
  }
  .img-62 {
    width: 60px;
    height: 60px;
  }

  .page {
  margin-top: 10px;
  :deep(.el-input__wrapper) {
    background-color: rgba(13, 33, 51, 1);
  }

}
  .liFontSize span {
    color: #FFFFFF;
    font-size: 14px;
  }
}

:deep(.btn-prev) {
  color: #FFFFFF;
  background: transparent !important;
}
:deep(.btn-next) {
  color: #FFFFFF;
  background: transparent !important;
}
:deep(.number) {
  background: transparent !important;
}
:deep(.el-pagination__total, .el-input__inner) {
  color: rgba(208, 227, 255, 1) !important;
}
:deep(.el-input__inner) {
  color: rgba(208, 227, 255, 1) !important;
}
:deep(.el-pagination__jump) {
  color: rgba(208, 227, 255, 1) !important;
}
:deep(.el-input__wrapper) {
  background-color: #0D2133;
  border: 1px solid #0D2133;
}
:deep(.more) {
  background: transparent !important;
}
</style>
<style lang="scss">
.el-dialog {
  background-color: #09111E;
  .el-dialog__header {
    padding: 10px 16px;
    margin-right: 0;
    .el-dialog__title {
      font-size: 24px;
      font-family: YouSheBiaoTiHei-Regular, YouSheBiaoTiHei;
      font-weight:600;
      color: #FFFFFF;
      line-height: 23px;
      letter-spacing: 2px;
      text-shadow: 0px 2px 10px #1B7EF2;
    }
    
    border-bottom:1px solid #0797FF;
  }
  .el-dialog__body {
    padding: 10px 16px;
  }
}

</style>
