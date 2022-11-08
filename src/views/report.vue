<template>
  <div class="report_container">
    <div class="header_input flex flex-space-between">
      <div class="flex cup" style="height: 30px; margin-left: 25px;" @click="routerBack()"><img :src="getAssetsFile('arrow.png')" alt="title" ><div style="margin-top: -5px; color: rgba(199, 220, 239, 1); font-size: 14px; line-height: 30px">返回</div></div>
      <SearchInput></SearchInput>
      <div></div>
    </div>
    <div class="answer flex flex-space-between" v-if="state.showAnswer">
      <img :src="getAssetsFile('qa.png')" alt="title" style="width: 8%; height: 100%;">
      <div>
        <div>一共有<span style="color: rgba(130, 255, 247, 1);margin-right: 10px;font-weight: bold;">23</span>个底事件，分别是：</div>
        <div class="normal_word qa_word"> 底事件1、底事件1、底事件1、底事件1、底事件1、底事件1、底事件1、底事件1、底事件2、底事件3、底事件4、底事件5、底事件6、底事件7、底事件8、底事件9、底事件10、底事件11、底事件12、底事件13、底事件14、底事件底事件3、底事件4、底事件5、底事件6、底事件7、底事件8、底事件9、底事件10、底事件11、底事件12、底事件13、底事件14、底事件13、底事件14、</div>
      </div>
    </div>
    <div class="title_container"><TitleComponent :title="state.title" :width="state.width"></TitleComponent></div>
    <div class="main_container">
        <div class="search_left_main" :style="{height: state.showAnswer === false ? '100%' : 'calc(100% - 90px)'}">

          <div style="color: #fff;">共{{state.relReport?.length}}篇报告：</div>

          <div class="result_item" v-for="item in state.relReport">

            <div class="item_self cup" @click="toDetail(item)">
              <div class="item_title flex flex-space-between">
                <div class="item_title_left flex">
                  <div class="tag">归零报告</div>
                  <div class="normal_title p_ellipsis" style="flex: 1;">{{ item.reportName }}</div>
                </div>
                <div class="item_title_right">{{ item?.propertiesName?.['日期']  }}</div>
              </div>

              <div class="item_content normal_word">
                {{ item.propertiesName['故障现象'] }}
              </div>
              <div class="item_result flex">
                <div class="tag_circle" style="color: rgba(248, 161, 59, 1); border: 1px solid rgba(248, 161, 59, 1);">{{ item.propertiesName['严酷度'] }}</div>
                <div class="tag_circle"  >{{ item.propertiesName['故障分类'] }}</div>
              </div>
            </div>
          </div>
        </div>
    </div>
    
  </div>

</template>


<script setup lang='ts'>
  import { reactive, onMounted, onActivated } from 'vue'
  import { getAssetsFile } from '@/utils/getAssetsFile.ts'
  import SearchInput from '@/components/searchInput/SearchInput.vue'
  import TitleComponent from '@/components/common/TitleComponent.vue'
  import { useRouter, useRoute } from 'vue-router';
  import { getFirstSearchList, getSecondSearchList, statisticsSearchNum } from '@/api/index.ts'
  import useEmitter from '@/hooks/useEmitter'
  const emitter = useEmitter()

const router = useRouter();
const route = useRoute();

const state = reactive({
  title: '相关报告',
  width: '90%',
  showAnswer: false,
  relReport:[],
})

const routerBack = () => {
  router.back()
}

const toDetail = async (item) => {
  window.sessionStorage.setItem("hotReport", JSON.stringify(item))
  await statisticsSearchNum(item.reportName)
  router.push({ path: '/detail', query:{
    searchKey: item.reportName, 
    from: 'report'
  }})
}

onMounted(
      async ()=>{
      state.relReport = JSON.parse(window.localStorage.getItem("secondSearchDetail"))
      emitter.on('secondSearchDetail',(value)=>{
        state.relReport = value
        window.localStorage.setItem("secondSearchDetail",JSON.stringify(state.relReport))
      })
    }    
)

</script>

<style scoped lang='scss'>
.report_container {
  width: 100%;
  height: calc(100vh - 110px);
  // border: 1px solid red;
  color: #fff;
  .header_input {
    width: 100%;
    height: 50px;
    margin-top: 15px;
  }
  .title_container {
    width: 60%;
    height: 30px;
    // border: 1px solid #fff;
    color: #000;
    margin: 0 auto;
    margin-top: 15px;
  }
  .main_container {
    width: 60%;
    height: 80%;
    color: #000;
    margin: 0 auto;
    margin-top: 15px;
  }
}
.search_left_main {
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar { // chrome safari
    display: none;
  }
  width: 100%;
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
      -webkit-line-clamp: 3;
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
.answer {
  padding: 10px;
  width: 59%;
  height: 10%;
  margin: 0 auto;
  background: rgba(9, 17, 30, 0.8000);
  border-left: 1px solid rgba(248, 161, 59, 1);
  border-right: 1px solid rgba(248, 161, 59, 1);
  margin-top: 10px;
  img{
    width: 25px ;
    height: 25px ;
  }
  span {
    font-size: 16px;
    font-family: PingFang SC-Bold, PingFang SC;
    color: #FFFFFF;
    line-height: 30px;
    margin-left: 10px;
  }
}
.qa_word {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
}
</style>