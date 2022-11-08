<template>
<!-- 首页路由的输入框 -->
  <el-tabs
    v-model="state.activeName"
    type="card"
    class="demo-tabs"
    @tab-click="handleClick"
    v-if="router.currentRoute.value.name ==='index'"
  >
    <el-tab-pane label="故障诊断" name="first">
      <div class="search_input_box">
        <el-input
          size="default"
          class="search_input mr10"
          placeholder="请输入故障现象"
          v-model="state.firstSearchInput"
          @keyup.enter="searchTouble()"
          clearable
        />
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #2acfe2;" > | </span>
          <button @click="searchTouble()" class="search_button cup"><img :src="getAssetsFile('icon_search.png')" ></button>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="知识检索" name="second">
      
      <div class="search_input_box">
        <el-input
          size="default"
          class="search_input mr10"
          placeholder="请输入检索内容"
          v-model="state.firstSearchInput"
          @keyup.enter="searchReport()"
          clearable
        />
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #2acfe2;" > | </span>
          <button @click="searchReport()" class="search_button cup"><img :src="getAssetsFile('icon_search.png')" ></button>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>


  <!-- 其他路由页面的输入框 -->
  <div class="flex other div_container" v-else>
    <el-select v-model="state.choosed" class="m-2" placeholder="Select" size="small" @change="selectChanged">
      <el-option
        v-for="item in state.options"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <div class="search_input_box" style="height: 33px; margin-top: 1px">
      <el-input
        size="default"
        class="search_input mr10 "
        placeholder="请输入检索内容"
        v-model="state.firstSearchInput"
        @keyup.enter.native="searchJudgment()"
        clearable
        @focus="changeFlag(true)"
      />
      <div style="display: flex; justify-content: space-between;">
        <span style="color: #2acfe2;" > | </span>
        <button @click="searchJudgment()" class="search_button cup"><img :src="getAssetsFile('icon_search.png')" ></button>
      </div>
    </div>

    <div class="list_container flex flex-center" style="z-index:99" v-show="state.flag">
      <el-scrollbar height="100%">
        <ul style="z-index:99;">
          <li v-if="state.choosed === '知识检索'" class="cup" style="z-index:99;text-overflow: ellipsis;white-space: nowrap;" v-for="(item,index) in state.searchList" :key="index" @click.stop="goto(item.reportName)">{{item.reportName}}</li>
          <li v-if="state.choosed === '故障诊断'" class="cup" style="z-index:99;text-overflow: ellipsis;white-space: nowrap;" v-for="(item,index) in state.searchList" :key="index" @click.stop="goto(item)">{{item}}</li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
  
  

</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, TabsPaneContext } from 'element-plus'
import { getAssetsFile } from '@/utils/getAssetsFile.ts'
import { useRouter,useRoute } from 'vue-router'
import debounce from '@/utils/debounce.ts'
import { getFirstSearchList, getSecondSearchList,statisticsSearchNum } from '@/api/index.ts'
import useEmitter from '@/hooks/useEmitter'
const emitter = useEmitter()
const useDebounce = new debounce();


const router = useRouter()
const route = useRoute()

const props = defineProps(
  {
    selectSearchKey:{
      type: String,
      default:""
    },
    searchResult:{
      type: Array,
      default:()=>[]
    }
  }
)

const emits = defineEmits(['sendSearchKey'])

// const activeName = ref('first')

const state = reactive({ 
  firstSearchInput: '',
  options: ['故障诊断', '知识检索'],
  choosed: '故障诊断',
  activeName: 'first',
  searchList:[],
  flag: false
})

const handleClick = async (tab: TabsPaneContext, event: Event) => {
  // state.firstSearchInput = ""
  state.searchList = []

  if(state.choosed === '故障诊断') {
    // 获取搜索到的内容数据
    const {data:res} = await getFirstSearchList()
    state.searchList = res.everybody_search_result
  } else {
    const {data:res} = await getSecondSearchList(state.firstSearchInput)
    state.searchList = res.data
  }

  emits("sendSearchKey",{
    type: state.activeName,
    searchKey: state.firstSearchInput
  })
}

const selectChanged = (tab) => {
  state.searchList = []
  state.firstSearchInput = ""
}

const searchTouble = () => {
  if(state.firstSearchInput) {
    router.push({ path: '/trouble',query:{
      searchKey: state.firstSearchInput
    }})
  } else {
    ElMessage.warning('请输入搜索内容')
  }
}
const searchReport = () => {
  if(state.firstSearchInput) {
    router.push({ path: '/report',query:{
      searchKey: state.firstSearchInput
    }})
  } else {
    ElMessage.warning('请输入搜索内容')
  }
}

// 其他页面的跳转
const searchJudgment = () => {
  if(state.choosed === '故障诊断') {
    router.push({ path: '/trouble',query: {
      searchKey:state.firstSearchInput
    }})
  } else {
    // 路由跳转前设置localStorage 
    emitter.emit('secondSearchDetail', state.searchList)
    router.push({ path: '/report',query:{
      searchKey: state.firstSearchInput
    }})
  }
}

const goto = async (searchKey) => {
  state.mark = true
  if(state.choosed === '故障诊断') {
    router.push({
      path: `/trouble`,
      query:{
        searchKey: searchKey
      }
    })
  } else{
    const {data:res} = await getSecondSearchList(searchKey)
    let knowledge = null;
    res.data.map(v => {
      v.reportName === searchKey ? knowledge = v : knowledge = {}
    })
    window.sessionStorage.setItem("hotReport", JSON.stringify(knowledge))
    await statisticsSearchNum(searchKey)
    router.push({
      path: `/detail`,
      query:{
        searchKey: searchKey
      }
    })
  }
  state.flag = false
}

watch(()=>state.firstSearchInput,async () => {
  if(router.currentRoute.value.name ==='index') {
    useDebounce.run(()=>{
      emits("sendSearchKey",{
          type: state.activeName,
          searchKey: state.firstSearchInput
      })
    },500)
  } 
    state.searchList = []
    if(state.choosed === '故障诊断') {
      // 获取搜索到的内容数据
      const {data:res} = await getFirstSearchList()
      state.searchList = res.everybody_search_result
    } else {
      const {data:res} = await getSecondSearchList(state.firstSearchInput)
      state.searchList = res.data
      // res.data && res.data.map(v => {
      //   state.searchList.push(v.reportName)
      // })
    }
  

  if(!state.firstSearchInput) {
    state.searchList = []
  }

})

watch(()=>props.selectSearchKey,() => {
  state.firstSearchInput = props.selectSearchKey
})

watch(()=>route.query,(query)=>{
  state.firstSearchInput = query.searchKey
},{immediate: true})

const changeFlag = (flag) => {
  setTimeout(() => {
    if (flag) state.flag = flag
  }, 100);
}


</script>

<style lang='scss' scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
:deep(.el-input__wrapper) {
  width: 450px;
  height: 30px;
  background: rgba(9, 17, 30, 1);
  border: 0;  
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4000);
  box-shadow: 0 0 0 0 !important;
}
:deep(.el-input__inner) {
  color: rgb(208, 227, 255) !important;
}
:deep(.el-tabs__header) {
  border: none !important;
}
:deep(.el-tabs__nav) {
  border: none;
  margin-left: 225px;
}
:deep(.el-tabs__item ) {
  color: rgba(255, 255, 255, 1); 
  padding: 0 10px !important;
  line-height: 30px;
  height: 30px;
  border: none !important;
}
:deep(.el-tabs__nav) {
  border: none !important;
}
:deep(.is-active) {
  border: 1px solid rgba(42, 207, 226, 0.5000) !important;
  color: rgba(42, 207, 226, 1) !important;
}
:deep(#tab-second) {
  margin-left: 10px;
}
:deep(.el-select ) {
  width: 120px;
  display: inline-block;
  margin-top: 2px;
}
:deep(.select-trigger) {
  border: 1px solid rgba(42, 207, 226, 0.5000) !important;
  height: 32px;
}

.div_container {
  position: relative;
  .list_container {
    overflow: hidden;
    position: absolute;
    top: 60px;
    left: 120px;
    margin-top: -20px;
    border-radius: 2px;
    width: 600px;
    background: rgba(9, 17, 30, 1);
    white-space: nowrap; 
    text-overflow: ellipsis;
    // padding: 0 8px;
    ul {
    overflow: hidden;
      width: 100%;
      white-space: nowrap; 
      text-overflow: ellipsis;
      li {
        overflow: hidden;
        white-space: nowrap; 
        text-overflow: ellipsis;
        padding: 0 8px;
        padding-left: 18px;
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
}
:deep(.el-scrollbar) {
  width: 600px;
}
</style>