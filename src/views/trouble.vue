<template>
  <div class="trouble_container ">
    <div class="top_container flex flex-space-between">
      <div class=" flex cup" style="height: 30px;" @click="routerBack()"><img :src="getAssetsFile('arrow.png')" alt="title" ><div class="back_word">返回</div></div>
      <SearchInput></SearchInput>
      <div></div>
    </div>

    <div class="title" style="text-align: center; margin-top: 10px;">
      <img :src="getAssetsFile('Frame 190.png')" style="margin-top: -10px;">
      {{route.query.searchKey}}
    </div>

    <div class="main_container flex flex-space-between">
      <div class="main_left">

        <!-- 左上 | 故障现象分析 -->
        <TitleComponent :title="state.title.phenomenon" :width="state.width.phenomenon"></TitleComponent>
        
        <div class="data_count flex flex-space-between flex_wrap">
          <div class="data_count_item flex flex-start">
            <img :src="getAssetsFile('设备.png')" >
            <div class="data_words"><span>设备</span><br><span>{{state.searchDetailData.equipment_name}}</span></div>
          </div>
          <div class="data_count_item flex flex-start">
            <img :src="getAssetsFile('分系统.png')" style="width: 50px;height: 50px;margin: 3px 3px 0 10px;">
            <div class="data_words"><span>分系统</span><br><span>{{state.searchDetailData.sub_system}}</span></div>
          </div>
          <div class="data_count_item flex flex-start">
            <img :src="getAssetsFile('星.png')" >
            <div class="data_words"><span>星</span><br><span>{{state.searchDetailData.satellite_name}}</span></div>
          </div>
          <div class="data_count_item2 flex flex-start">
            <img :src="getAssetsFile('现象.png')" style="margin-left: 10px;margin-top: 4px;">
            <div class="data_words"><span>参数</span><br><span>{{state.searchDetailData.parameter_name}}</span></div>
          </div>
          <div class="data_count_item2 flex flex-start">
            <img :src="getAssetsFile('故障原因.png')" >
            <div class="data_words"><span>参数现象</span><br><span>{{state.searchDetailData.parameter_sym}}</span></div>
          </div>
        </div>

        <!-- 左下 | 故障相关报告 -->
        <div class="flex flex-space-between">
          <div style="width: 78%;"><TitleComponent :title="state.title.report" :width="state.width.report"></TitleComponent></div>
          <div class="cup grep_word">相关性
              <img :src="getAssetsFile('up_down.png')" alt="title" style="width: 20px;margin-top: -3px;">
          </div>
          <div class="cup grep_word" @click="sortByDate()">发布时间
              <img :src="getAssetsFile('up_down.png')" alt="title" style="width: 20px;margin-top: -3px;">
          </div>
        </div>

        <div class="report_main">
          <div class="result_item" v-for="item in state.troubleData">
            <div class="item_self cup" @click="toDetail(item)">
              <div class="item_title flex flex-space-between">
                <div class="item_title_left flex">
                  <div class="tag">归零报告</div>
                  <div class="normal_title p_ellipsis" style="flex: 1;">{{ item?.reportName }} </div>
                </div>
                <div class="item_title_right">{{ item?.propertiesName?.['日期'] }}</div>
              </div>

              <div class="item_content normal_word">
                {{ state.searchHighReason }}
              </div>

              <div class="item_result flex">
                <div class="tag_circle" style="color: rgba(248, 161, 59, 1); border: 1px solid rgba(248, 161, 59, 1);">{{ item?.propertiesName?.['严酷度'] }}</div>
                <div class="tag_circle" >{{ item?.propertiesName?.['故障分类'] }}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="main_right">
        <!-- 右上 | 故障影响范围 -->
        <div class="flex flex-space-between">
          <TitleComponent :title="state.title.influnce" :width="state.width.influnce" style="width: 90%;"></TitleComponent>
          <div style="width: 10%; " class="cup title_com_right" @click='state.dialog.influence=true'>影响范围图谱
              <img :src="getAssetsFile('icon_turn-left.png')" alt="title" >
          </div>
        </div>

        <div class="influnce_container flex flex-space-between flex_wrap" >
          <div class="influnce_item flex flex-space-between"  v-for="item in state.influnceNodes">
            <span>{{ item.name }}</span>
            <span class="tag" style="color: rgba(62, 142, 255, 1);">{{ item.starName }} - {{ item.label }}</span>
          </div>
        </div>

        <!-- 右下 | 故障原因诊断 -->
        <div class="flex flex-space-between">
          <TitleComponent :title="state.title.reason" :width="state.width.influnce" style="width: 90%; flex-shrink: 1;"></TitleComponent>
          <div style="width: 10%; " class="cup title_com_right" @click="getFaultAnslyse">故障概率分析
              <img :src="getAssetsFile('icon_turn-left.png')" alt="title" >
          </div>
        </div>

        <div class="reason_main flex flex-space-between">
          <div class="reason_left">
            <div class="reason_item flex cup flex-space-between" v-for="(item,index) in state.searchDetailData.gzxx_reason_json" :key="index" @click="clickReason(index)" :style="state.activeReason === index ? 'background: rgba(20, 37, 65, 0.8000)' : ''">
              <div class="item_progress"><el-progress type="circle" :percentage="keepTwoDecimal(item.Event_score)" color="rgba(42, 207, 226, 1)" :stroke-width="12"/></div>
              <div class="reason_word">
                <div class="normal_title p_ellipsis" >{{item.Event_name}}</div>
                  <div class="item_content normal_word">{{item.Event_sugguestion}}</div>
                <div class="reason_btn flex flex-end">
                  <span class="cup" @click="showSuggestion(item.Event_sugguestion)">措施建议<img :src="getAssetsFile('icon_turn-left.png')" ></span>
                  <span class="cup" @click.stop="toReasonReport(item.Event_name)">查看报告<img :src="getAssetsFile('icon_turn-left.png')" ></span>
                </div>
              </div>
            </div>
          </div>

          <div class="reason_right">
            <div class="normal_title" style="margin-bottom: 10px; font-weight: bold;color: #FFFFFF;line-height: 24px;">故障原因图谱</div>
            <CyGraph :reason="state.activeReasonName" :type='"reason"' v-if="state.activeReasonName"></CyGraph>
          </div>

        </div>
      </div>
    </div>

    <el-dialog
      v-model="state.treeDialogVisible"
      title="故障概率分析"
      width="1500px"
      :before-close="sendCloseDialog"
      destroy-on-close
      :show-close="false"
    >
      <DagreComponent :data="state.treeEchartData"></DagreComponent>
    </el-dialog>
    <el-dialog
     :show-close="false"
      v-model="state.dialog.influence"
      title="故障影响图谱"
      width="1200px"
      :before-close="sendCloseDialog"
      destroy-on-close
    >
    <CyGraph :type='"influence"' :influenceReason='state.searchHighReason'></CyGraph>
    </el-dialog>
    <el-dialog
      v-model="state.dialog.reason"
      title="处置措施建议"
      width="1200px"
      :show-close="false"
      :before-close="sendCloseDialog"
    >
      <div class="advice_content normal_word"> {{ state.eventSuggestion }}</div>
    </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { reactive, onMounted, watch, computed } from 'vue'
import TitleComponent from '@/components/common/TitleComponent.vue'
import { getAssetsFile } from '@/utils/getAssetsFile.ts'
import SearchInput from '@/components/searchInput/SearchInput.vue'
import DagreComponent from '@/components/common/DagreComponent.vue'
import CyGraph from '@/components/influenceCyGraph/CyGraph.vue'
import { getSearchDetailList, getTreeEchartData, nodeList, reportListByReason, getReportList, statisticsSearchNum  } from '@/api/index.ts'
import { useRouter, useRoute } from 'vue-router';

import useEmitter from '@/hooks/useEmitter'
const emitter = useEmitter()

const router = useRouter();
const route = useRoute();

const state = reactive({ 
  page: {
    pageNum: 1,
    pageSize: 10,
    total: 0
  },
  title:{
    phenomenon: '故障现象分析',
    report: '故障相关报告',
    influnce: '故障影响范围',
    reason: '故障原因诊断',
  },
  width:{
    phenomenon: '78%',
    report: '70%',
    influnce: '82%',
  },
  troubleData:[],
  influnceData: [],
  reasonData: [],
  treeDialogVisible: false,
  dialog: {
    influence: false,
    reason: false,
  },
  type: 'influence',
  activeReason: 0,
  searchDetailData:{},
  treeEchartData:[],
  highestReason: '',
  influnceNodes: [],
  eventSuggestion: '',
  activeReasonName: '',  // 当前选中的原因
  searchHighReason: '',  // 最高概率的原因（用于检索图谱path和实体）
})

const routerBack = () => {
  router.back()
}

const toDetail = async (item) => {
  window.sessionStorage.setItem("hotReport", JSON.stringify(item))
  await statisticsSearchNum(item.reportName)
  router.push({ path: '/detail', query: {
    searchKey: item.reportName
  }})
}

const toReasonReport = async (name) => {
  const {data: res} = await reportListByReason(name);
  emitter.emit('secondSearchDetail',res.data)
  router.push({ path: '/report', query: {reasonName: name}})
}

// 点击故障原因 切换处置措施建议
const clickReason = (index) => {
  state.activeReason = index
  if(state.searchDetailData && state.searchDetailData.gzxx_reason_json && state.searchDetailData.gzxx_reason_json.length > 0) {
    state.activeReasonName = state.searchDetailData.gzxx_reason_json[index].Event_name
  }
}

// 得到故障概率分析的弹框
const getFaultAnslyse = () => {
  state.treeDialogVisible = true
}

// 关闭弹框
const sendCloseDialog = () => {
  state.treeDialogVisible = false
  state.dialog.influence = false
  state.dialog.reason = false
}

const treeEchartDataComputed = async (searchKey) => {
  const {data: res} = await getTreeEchartData(searchKey);
  const {data:trobuleData} = await getReportList(JSON.stringify(res.nodes[1]?.label))
  state.troubleData = trobuleData.data
  // 故障相关报告日期排序方法
  state.troubleData?.map((item) => {
   item.sortDate = item?.propertiesName?.['日期'].replace('年', '-').replace('月', '-').replace('日', '')
  })
  state.treeEchartData.edges = res.edges.map(v => {
    v.source = String(v.source);
    v.target = String(v.target);
    v.label = String(v.label).substring(0,5);
    return v;
  })

  function formartLength(val, size) {
    if (val.length > size * 2) {
      let text =
        val.slice(0, size) +
        "\n" +
        val.slice(size, size * 2) +
        "\n" +
        val.slice(size * 2, val.length);
      return text;
    }
    if (val.length > size) {
      let text = val.slice(0, size) + "\n" + val.slice(size);
      return text;
    }
    return val;
  }

  state.searchHighReason = JSON.stringify(res.nodes[1]?.label)

  state.treeEchartData.nodes = res.nodes.map(v => {
    v.id = String(v.id);
    if(v.label.length > 50) {
      // v.bottomText = formartLength(String(v.label),100)
      v.bottomText = formartLength(String(v.label),80)
    } else {
      // v.bottomText = formartLength(String(v.label),6);
      v.bottomText = formartLength(String(v.label),80)
    }
    delete v.label
    return v;
  })
  state.highestReason = state.treeEchartData.nodes[1]?.label
  state.highestReason = JSON.stringify(state.treeEchartData.nodes[1]?.label)
  getNodeList(state.searchHighReason)
}

// 查询故障影响范围实体
const getNodeList = async (startName) => {
  const {data: res} = await nodeList(state.searchHighReason);
  state.influnceNodes = res.data
}

// 展示措施建议弹框
const showSuggestion = (suggestion) => {
  state.dialog.reason=true
  state.eventSuggestion = suggestion
}

// 小数处理方法
const keepTwoDecimal = (num) => {
  var result = parseFloat(num);  
  result = Math.round(num * 100);  
  return result; 
}

// 故障相关报告 | 发布时间 | 排序
const sortByDate = () => {
  state.troubleData.sort((a,b) => {
    return new Date(b.sortDate) - new Date(a.sortDate)
  })
}

onMounted( async () => {
  if(route.query.searchKey) {
    const {data: res} = await getSearchDetailList(route.query.searchKey, 1)
    state.searchDetailData = res
    if(state.searchDetailData) {
      clickReason(0)
    }
    treeEchartDataComputed(route.query.searchKey)
  }
})

watch(()=>route.query,async (query)=>{
  if(query) {
    console.log('query',query)
    const {data: res} = await getSearchDetailList(query.searchKey, 1)
    state.searchDetailData = res
    if(state.searchDetailData) {
      clickReason(0)
    }
    treeEchartDataComputed(route.query.searchKey)    
  } else {
    router.push({ path: '/'})
  }

},{immediate:true})

</script>


<style scoped lang='scss'>
.trouble_container {
  width: 100%;
  height: calc(100vh - 110px);
  color: #fff;
  .top_container {
    width: 97%;
    height: 5%;
    margin: 0 auto;
    margin-top: 10px;
  }
  .main_container {
    width: 97%;
    height: 88%;
    margin: 0 auto;
    margin-top: 10px;
    .main_left {
      width: 40%;
      // border: 1px solid red;
      .data_count {
        align-items: center;
        height: 15vh;
        overflow: scroll;
        &::-webkit-scrollbar { // chrome safari
          display: none;
        }
        .data_count_item {
          background: rgba(9, 17, 30, 0.8000);
          flex-basis: 32%;
          margin-bottom: 10px;
          img {
            height: 60px;
            width: 60px;
          }
        }
        .data_count_item2 {
          background: rgba(9, 17, 30, 0.8000);
          flex-basis: 49%;
          margin-bottom: 15px;
          img {
            height: 50px;
            width: 50px;
          }
        }
        .data_words {
          margin:auto 0;
          margin-top: 10px;
          margin-left: 10px;
          span {
            display: inline-block;
            margin-bottom: 10px;
          }
          :nth-child(3) {
            color: rgba(42, 207, 226, 1);
          }
        }
      }
      .report_main {
        margin-top: 5px;
        width: 100%;
        height: 70%;
        overflow: scroll;
        // border: 1px solid red;
        &::-webkit-scrollbar { // chrome safari
          display: none;
        }
        .item_self {
            margin-top: 10px;
            background: rgba(9, 17, 30, 0.8000);
            padding: 15px 20px;
            &:hover {
              background: rgba(20, 37, 65, 0.8000);
            }
            .item_title_left {
              width: 70%;
              height: 23px;
              div {
                margin-right:5px;
              }
            }
            .item_title_right {
              font-size: 14px;
              font-family: PingFang SC-Bold, PingFang SC;
              color: #FFFFFF;
              line-height: 20px;
            }
            .item_content {
              margin-top: 5px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .item_result {
              margin-top: 10px;
              div{
                margin-right: 5px;
              }
            }
          }
      }
    }
    .main_right {
      width: 59%;
      .influnce_container {
        height: 11.5vh;
        padding: 10px;
        background: rgba(9, 17, 30, 0.8000);
        overflow: scroll;
        margin-bottom: 1.6vh;
        &::-webkit-scrollbar { // chrome safari
          display: none;
        }
        .influnce_item {
          height: 28px;
          line-height: 28px;
          width: 48%;
        }
      }
      .reason_main {
        margin-top: 5px;
        width: 100%;
        height: 70%;
        .reason_left {
          width: 59%;
          overflow: scroll;
          &::-webkit-scrollbar { // chrome safari
            display: none;
          }
          .reason_item {
            margin-top: 10px;
            padding-top: 10px;
            padding-left: 15px;
            padding-right: 15px;
            width: 96%;
            background: rgba(9, 17, 30, 0.8000);
            &:hover {
              background: rgba(20, 37, 65, 0.8000);
            }
            .item_progress {
              align-items: center;
              width: 15%;
              margin-right: 10px;
              min-width: 100px;
            }
            .reason_word {
              width: 84%;
            }
            .item_content {
              margin-top: 5px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
            }
            .reason_btn {
              margin-top: 7px;
              margin-bottom: 7px;
              span {
                color: rgba(23, 193, 212, 1)
              }
              .cup {
                &:hover {
                  font-weight: bold;
                }
              }
              :first-child{
                margin-right: 5px;
              }
            }
          }
        }
        .reason_right {
          background: rgba(9, 17, 30, 0.8000);
          margin-top: 10px;
          width: 38%;
          padding: 10px;
          overflow: scroll;
          &::-webkit-scrollbar { // chrome safari
            display: none;
          }
        }
      }
      .graph_btn {
        width: 5%;
        position: absolute; 
        top: 115px; 
        left: 70%;
        color: rgba(23, 193, 212, 1);
      }
    }
  }
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
:deep(.el-progress-circle) {
  width: 80px !important;
  svg {
    margin-top: 20px;
  }
}
:deep(.el-progress__text) {
  top: 45% !important;
  color: rgba(42, 207, 226, 1);
  line-height: 23px;
  letter-spacing: 1px;
}
:deep(.el-progress-circle__track){
  stroke: rgba(196, 196, 196, 0.4);
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
  background-color: rgba(9, 17, 30, 0.8000);;
  // border: 1px solid #0D2133;
}
:deep(.more) {
  background: transparent !important;
}
:deep(.el-select-dropdown__wrap) {
  background: red !important;
}
.grep_word {
  min-width: 100px; margin-top: 10px;text-align: right;
  &:hover {
    font-weight: bold;
  }
}
.advice_content {
  margin-top: 10px;
  height: 500px;
  max-height:500px;
}
</style>
<style >
.tool-tip {
  max-width: 510px;
}
</style>