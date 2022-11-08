<template>
<el-scrollbar>
  <div class="all_container flex flex-center">
    <div class="center_container flex flex-center">
      <div class="title_container">
        <div class="webpage_title">卫星故障知识图谱应用</div>
        <img :src="getAssetsFile('ligth.png')" alt="title" >
      </div>
      <div class="input_container flex flex-center">
        <div>
          <SearchInput @sendSearchKey="getSearchKey" :selectSearchKey="state.selectSearchKey" ></SearchInput>
        </div>
        <div class="list_container flex flex-center cup" style="z-index:99999" v-show="state.searchList.length !== 0">
          <el-scrollbar height="100%">
            <ul style="z-index:99999;">
              <!-- <div class="flex flex-end cup" style="margin-top: 4px; margin-right: 4px;" @click='state.hintList=false'><span style="color: #82FFF7">收起</span></div> -->
              <li class="cup" style="z-index:99999;text-overflow: ellipsis;white-space: nowrap;" v-for="(item,index) in state.searchList" :key="index" @click="searchKeyContent(item)">{{item}}</li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    
      <div class="hot_container">
        <div class="search_group" style="color: rgba(248, 161, 59, 1);"><img :src="getAssetsFile('大家在搜.png')" alt="title" class="small_img">大家在搜</div>
        <div class="hotSearch flex flex-start cup">
          <el-tooltip
            class="box-item  flex flex-start"
            effect="dark"
            :content="item"
            placement="top"
            v-for="item in state.hotSearch"
          >
            <div class="p_ellipsis" @click="hotSearchClick(item)">{{ item }}</div>
          </el-tooltip>
        </div>
      </div>

      <div class="report_container">
        <div class="search_group" style="color: rgba(130, 255, 247, 1);"><img :src="getAssetsFile('热门报告.png')" alt="title" class="small_img">热门报告</div>
        <div class="hotReport flex flex-start" >
          <div class="report_item cup" v-for="item in state.hotReport" @click="hotReportClick(item)">
            <div class="normal_title p_ellipsis">{{ item.reportName }}</div>
            <div class="normal_word">{{ item.propertiesName.产生原因 }}</div>
            <div class="flex flex-space-between" style="margin-top: 20px;">
              <div class="tag">{{ item.propertiesName.故障分类 }}</div>
              <div style="margin-top: 5px;">{{ item.propertiesName.日期}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="data_container">
        <div class="search_group" style="color: rgba(62, 142, 255, 1);"><img :src="getAssetsFile('数据统计.png')" alt="title" class="small_img" >数据统计</div>
        <div class="dataCount flex flex-space-around">
          <DataCount :homeStatistics="state.homeStatistics" v-if="state.ifShowHomeStatistics"></DataCount>
        </div>
      </div>
    </div>
  </div> 
</el-scrollbar>
</template>

<script setup lang='ts'>
import { reactive, onMounted } from 'vue'
import { getAssetsFile } from '@/utils/getAssetsFile.ts'
import SearchInput from '@/components/searchInput/SearchInput.vue'
import DataCount from '@/components/dataCount/DataCount.vue'
import TreeEchartComponent from '@/components/common/TreeEchartComponent.vue'
import { getFirstSearchList, getSecondSearchList,statisticsSearchNum } from '@/api/index.ts'
import { getSearchList, selectHomeStatistics, everybody_search_query, selectHotReport } from '@/api/index.ts'
import { useRouter, useRoute } from 'vue-router';

import useEmitter from '@/hooks/useEmitter'
const emitter = useEmitter()

const router = useRouter();
const route = useRoute();

const state = reactive({
  hotSearch: [], //热门搜索选项
  hotReport: [],
  searchList:[],
  selectSearchKey:"",
  selectType:"",
  secondSearchList:[],
  ifShowHomeStatistics: false,
  homeStatistics: {},
})

const hotSearchClick = (searchKey: String) => {
  router.push({ 
    path: '/trouble',
    query:{
      searchKey: searchKey
    }
  })
}

const hotReportClick = async (item) => {
  window.sessionStorage.setItem("hotReport",JSON.stringify(item))
  await statisticsSearchNum(item.reportName)
  router.push({ path: '/detail', query:{
    searchKey: item.reportName,
    from: 'index'
  }})
}

const getSearchKey = async (searchObj) => {
  const { type, searchKey } = searchObj
  state.selectType = searchObj.type
  state.searchList = []
  if(type==='first' && searchKey) {
    // 获取搜索到的内容数据
    const {data:res} = await getFirstSearchList()
    state.searchList = res.everybody_search_result
  } else if(type==='second' && searchKey){
    const {data:res} = await getSecondSearchList(searchKey)
    state.secondSearchList = res.data
    res.data && res.data.map(v => {
      state.searchList.push(v.reportName)
    })
    emitter.emit('secondSearchDetail', state.secondSearchList)
  }
}

const searchKeyContent = async (searchKey) => {
  state.selectSearchKey = searchKey
  if(state.selectType === 'first') {
    router.push({
      path: `/trouble`,
      query:{
        searchKey: searchKey
      }
    })
  } else if (state.selectType === 'second') {
    await statisticsSearchNum(searchKey)  //统计搜索的次数
    emitter.emit('secondSearchDetail',state.secondSearchList)
    router.push({
      path: `/detail`,
      query:{
        searchKey: searchKey
      }
    })
    // await statisticsSearchNum(searchKey)  //统计搜索的次数
    // emitter.emit('secondSearchDetail',state.secondSearchList)
  }
}

// 获取 数据统计 数据
const getSelectHomeStatistics = () => {
  selectHomeStatistics().then(res => {
    state.homeStatistics = res.data.data
    state.ifShowHomeStatistics = true
  })
}

// 获取 大家在搜 数据
const get_everybody_search_query = () => {
  everybody_search_query().then(res => {
    state.hotSearch = res.data.everybody_search_result
  })
}

// 获取 热门报告 数据
const getSelectHotReport = () => {
  selectHotReport().then(res => {
    if(res.data.data.length > 3) {
      state.hotReport = res.data.data.slice(0,3)
    } else {
      state.hotReport = res.data.data
    }
  })
}


onMounted(()=>{
  getSelectHomeStatistics()
  get_everybody_search_query()
  getSelectHotReport()
})

</script>

<style scoped  lang='scss'>
.all_container {
    width: 100%;
    height: calc(100vh - 110px);
    color: #fff;
    .center_container {
      width: 60%;
      // height: 90%;
      padding: 20px;
      flex-wrap: wrap;
      .title_container {
        img{
          width: 440px;
          height: 10px;
        }
      }
      .input_container {
        position: relative;
        width: 100%;
        height: 85px;
        margin-top: 20px;
      }
      .list_container {
        position: absolute;
        top: 115px;
        margin-top: -20px;
        border-radius: 2px;
        width: 600px;
        background: rgba(9, 17, 30, 1);
        white-space: nowrap; 
        text-overflow: ellipsis;
        padding: 0 8px;
        ul {
          width: 100%;
          white-space: nowrap; 
          text-overflow: ellipsis;
          li {
            overflow: hidden;
            white-space: nowrap; 
            text-overflow: ellipsis;
            padding: 0 8px;
            width: 100%;
            height: 25px;
            line-height: 25px;
            text-align: left;
            &:hover {
              background-color: #26374F;
            }
          }
        }
      }
      .hot_container {
        width: 80%;
        height: 80px;
      }
      .report_container {
        width: 80%;
        // height: 35%;
        .hotReport {
          width: 100%;
          // height: 80%;
          // margin-top: 8px;
          padding-left: 10px;
          .report_item {
            // margin-top: 10px;
            margin-right: 20px;
            padding: 15px;
            background: rgba(9,17,30,0.8);
            box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
            border-radius: 2px 2px 2px 2px;        
            width: 27%;    
            height: 170px;
            min-width: 180px;
            &:hover {
              background: rgba(20,37,65,0.8);
            }
            .normal_word {
              height: 90px;
              padding-top: 10px;
              // border: 1px solid red;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 4;
              overflow: hidden;
              word-break: break-all;
              text-overflow: ellipsis;
              margin-top: 5px;
              margin-bottom: 10px;
              // border: 1px solid red;
            }
          }

        }
      }
      .data_container {
        width: 80%;
        // height:  30%;
      }
    }

}
  .hotSearch {
    width: 100%;
    // margin-top: 5px;
    flex-wrap: wrap;
    align-items: center;
    div {
      color: rgba(199, 220, 239, 1);
      margin-left: 2%;
      font-size: 12px;
      background: rgba(9, 17, 30, 1);
      padding: 5px 8px;
      border-radius: 5px;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      max-width: 14%;
      &:hover {
        color: rgba(255, 255, 255, 1);
        background: rgba(20,37,65,0.8);
      }
    }
  }
.small_img {
  margin-top: -5px;
  margin-left: 10px;
}
</style>

<style>
.el-scrollbar {
  width: 100%;
}
</style>