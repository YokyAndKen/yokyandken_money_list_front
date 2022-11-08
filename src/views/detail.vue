<template>
  <div class="detail_container">
    <div class="back_container flex cup" style="align-items: center; margin-top: 10px;" @click="routerBack()">
      <img :src="getAssetsFile('arrow.png')" alt="title" ><div class="back_word">返回</div>
    </div>
    <div class="flex flex-space-between" style="height: 100%;">
      <div class="detail_left_container ">
        <div class="flex flex-space-between">
          <TitleComponent :title="state.title" :width="state.width" style="width: 94%; flex-shrink: 1;"></TitleComponent>
          <div style="width:6%; " class="cup title_com_right" @click="state.dialog=true">报告图谱
              <img :src="getAssetsFile('icon_turn-left.png')" alt="title" >
          </div>
        </div>

        <!-- 左侧上方标题框 -->
        <div class="item_self" >
          <div class="item_title flex flex-space-between">
            <div class="item_title_left flex">
              <div class="tag">归零报告</div>
              <div class="normal_title p_ellipsis" style="flex: 1;">{{ state.recommendDetail?.reportName }}</div>
            </div>
            <div class="item_title_right">{{ state.recommendDetail?.propertiesName?.['日期']  }}</div>
          </div>

          <div class="item_result flex">
            <div class="tag_circle" style="color: rgba(248, 161, 59, 1); border: 1px solid rgba(248, 161, 59, 1);">{{ state.recommendDetail?.propertiesName?.['严酷度']}}</div>
            <div class="tag_circle" >{{ state.recommendDetail?.propertiesName?.['故障分类'] }}</div>
          </div>
        </div>

        <!-- 左侧下方文章内容框 -->
        <div class="left_content">
          <div v-if="state.recommendDetail?.propertiesName?.['现象类型']"><span style="color: #3E8EFF">现象类型：</span>{{ state.recommendDetail?.propertiesName?.['现象类型']  }}</div> <br>
          <div v-if="state.recommendDetail?.propertiesName?.['产生原因']"><span style="color: #3E8EFF">产生原因：</span>{{ state.recommendDetail?.propertiesName?.['产生原因']  }}</div> <br>
          <div v-if="state.recommendDetail?.propertiesName?.['处置方式']"><span style="color: #3E8EFF">处置方式：</span>{{ state.recommendDetail?.propertiesName?.['处置方式']  }}</div> <br>
          <div v-if="state.recommendDetail?.propertiesName?.['备注']"><span style="color: #3E8EFF">备注：</span>{{ state.recommendDetail?.propertiesName?.['备注']  }}</div> <br>
          <div v-if="state.recommendDetail?.propertiesName?.['底事件']"><span style="color: #3E8EFF">底事件：</span>{{ state.recommendDetail?.propertiesName?.['底事件']  }}</div> 
        </div>


      </div>
      <div class="detail_right_container">
        <TitleComponent :title="state.rightTitle" :width="state.rightWidth"></TitleComponent>
        <div class="relate_container">
          <div class="recommond_item cup"  v-for="(item, index) in state.recommondReport" :key='index' @click="getRecommendDetail(item)">
            <div class="flex flex-start">
              <div class="tag">归零报告</div>
              <div class="normal_title p_ellipsis">{{item.reportName }}</div>
            </div>
            <div class="flex flex-end">
              <div class="date">{{item?.propertiesName?.['日期'] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
          <el-dialog
            v-model="state.dialog"
            title="报告图谱"
            width="1200px"
            :before-close="sendCloseDialog"
            :show-close="false"
          >
          <CyGraph :type='"report"' :reportName='route.query.searchKey' v-if="state.dialog"></CyGraph>
          </el-dialog>
  </div>
</template>

<script setup lang='ts'>
import { reactive, onMounted, watch } from 'vue'
import TitleComponent from '@/components/common/TitleComponent.vue'
import { getAssetsFile } from '@/utils/getAssetsFile.ts'
import { useRouter, useRoute } from 'vue-router';
import { getRelRecommend, statisticsSearchNum } from '@/api/index.ts'
import CyGraph from '@/components/influenceCyGraph/CyGraph.vue'
import useEmitter from '@/hooks/useEmitter'
const emitter = useEmitter()


const router = useRouter();
const route = useRoute();

const state = reactive({
  dialog: false,
  title: '报告详情',
  width: '62vw',
  rightTitle: '相关报告推荐',
  rightWidth: '15vw',
  recommondReport: [],
  allRecommend:[],
  recommendDetail:{}
})


const routerBack = () => {
  router.back()
}

const getRecommendDetail = async (data) => {
  state.recommendDetail = data
  await statisticsSearchNum(data.reportName)
  const { data: res } = await getRelRecommend(data.reportName)
  state.recommondReport = res.data
} 

onMounted(async ()=>{
    // console.log("onMounted", route.query.from)
    const searchKey = route.query.searchKey
    const { data: res } = await getRelRecommend(searchKey)
    state.recommondReport = res.data
    state.recommendDetail = JSON.parse(window.sessionStorage.getItem("hotReport"))
    // await statisticsSearchNum(state.recommendDetail.reportName)
})


</script>


<style scoped lang='scss'>
.detail_container {
  width: 97%;
  height: calc(100vh - 110px);
  color: #fff;
  margin: 0 auto;
  .back_container {
    width: 100%;
    height: 3%;
  }
  .detail_left_container {
    width: 75%;
    height: 95%;
    padding-top: 10px;
    .graph_btn {
      min-width: 100px;
      position: absolute; 
      top: 125px; 
      left: 70%;
      color: rgba(23, 193, 212, 1);
    }
    .item_self {
      margin-top: 10px;
      background: rgba(9, 17, 30, 0.8000);
      padding: 15px 20px;
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
      .item_result {
        margin-top: 10px;
        div{
          margin-right: 5px;
        }
      }
    }
    .left_content {
      height: 78%;
      margin-top: 10px;
      background: rgba(9, 17, 30, 0.8000);
      padding: 15px 20px;
      overflow: scroll;
      color: #C7DCEF;
      line-height: 22px;
      &::-webkit-scrollbar { // chrome safari
        display: none;
      }
    }
  }
  .detail_right_container {
    width: 24%;
    height: 96%;
    padding-top: 10px;
    .relate_container {
      width: 100%;
      height: 95%;
      overflow: scroll;
      &::-webkit-scrollbar { // chrome safari
        display: none;
      }
    }
    .recommond_item {
      margin-top: 10px;
      padding: 10px;
      width: 100%;
      background: rgba(9, 17, 30, 0.8000);
      .normal_title {
        margin-left: 10px;
        width: 75%;

      }
      .date {
        color: rgba(255, 255, 255, 0.6000); 
        margin: 10px 20px 0 0;
      }
      &:hover {
        background: rgba(20,37,65,0.8);
      } 
    }
  }
}
</style>