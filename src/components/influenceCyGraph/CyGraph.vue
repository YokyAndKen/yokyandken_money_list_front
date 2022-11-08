<template>
  <div style="height: 500px;">
    <div style="height: 100%;">
      <CytoscapeComponent
        style="width:100%;height:100%;background-color: #09111E;"
        ref="cytoscapeComponentRef"
        :data="state.graphData"
        :paths="state.ids"
        :endPoints="state.endPoints"
        :isDbclickEvents="true"
        :isShowHeader="true"
        @getMoreDataFn="getMoreDataFn($event)"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, ref } from 'vue';
import CytoscapeComponent from '@/components/tks-g-render/index.vue'
import { getRelationPath } from "@/components/tks-g-render/getRelationPath.js"
import path from './path.json'
import { influencePath, more } from '@/api/index.ts'

const cytoscapeComponentRef = ref(null)

const props = defineProps({
  number: {
    type: String,
    default: () => ''
  },
  type: {
    type: String,
    default: () => ''
  },
  reason: {
    type: String,
    default: () => ''
  },
  reportName: {
    type: String,
    default: () => ''
  },
  influenceReason: {
    type: String,
    default: () => ''
  },
})

const state = reactive({
  data:{
    nodes:[],
    edges:[]
  },
  cyData: {},
  graphData: {
    nodes: [],
    edges: []
  },
  endPoints: [],
  pathIndex: "",
  pathsData: [],
  ids: [],
})

// 图谱
const handleEchartsData = (data) => {
  
  data.nodes = data.nodes.map((item, index) => ({
    ...item,
    name: item.properties.name,
    rootId: `${index + 1}000`,
    isExpand: false
  }))
  data.edges = data.relationships.map((item, index) => ({
    ...item,
    source: item.start,
    target: item.end,
    rootId: `${index + 1}000`
  }))
  return data
}


const getMoreDataFn = async (params) => {
  // console.log('图谱', params)
  const rootId = params.rootId
  let currentData = JSON.parse(JSON.stringify(state.graphData))
  const currentNodeIndex = currentData.nodes.findIndex(n => n.id === params.id)
  const currentEdgeIndex = currentData.edges.findIndex(e => e.rootId === rootId)
  if (currentData.nodes[currentNodeIndex].isExpand) {
    currentData.nodes[currentNodeIndex].isExpand = false
    // 存储不等于rootId的项
    const nodeArr = currentData.nodes.filter(node => {
      return node.rootId.search(rootId) !== 0
    })
    const edgeArr = currentData.edges.filter(edge => {
      return edge.rootId.search(rootId) !== 0
    })
    // 返回新数据
    if (currentNodeIndex !== -1) {
      currentData.nodes = [...nodeArr, currentData.nodes[currentNodeIndex]]
    } else {
      currentData.nodes = [...nodeArr]
    }
    if (currentEdgeIndex !== -1) {
      currentData.edges = [...edgeArr, currentData.edges[currentEdgeIndex]]
    } else {
      currentData.edges = [...edgeArr]
    }
    state.graphData = currentData
  } else {
    currentData.nodes[currentNodeIndex].isExpand = true
    const dataParams = {
      id: params.id,
      label: params.label,
      userId: params.userId || ''
    }

    // ???? todo
    const result = await more(params.label, params.name)
    const res = result.data.data
    const nodes = res.nodes.map((item, index) => {
      if (currentData.nodes.find($item => $item.id === item.id)) return null
      return {
        ...item,
        name: item.properties.name,
        rootId: `${rootId}${index + 1}000` 
      }
    })
    const edges = res.relationships.map((item, index) => {
      if (currentData.edges.find($item => $item.id === item.id)) return null
      return {
        ...item,
        source: item.start,
        target: item.end,
        rootId: `${rootId}${index + 1}000`
      }
    })
    currentData.nodes = currentData.nodes.concat(nodes.filter(item => !!item))
    currentData.edges = currentData.edges.concat(edges.filter(item => !!item))
    state.graphData = currentData

    // 展开的项去查询关系发现
    setTimeout(() => {
      getRelationPath([params.id], cytoscapeComponentRef.value.state.cy, false)
    }, 200)
  }
}

// 影响范围图谱 | 数据
const getInfluencePath = () => {
  influencePath(props.influenceReason).then(res => {
    state.ids = res.data.data.ids
    state.data = res.data.data.graphParseResponse
    state.graphData = handleEchartsData(state.data)
  })  
}

// 故障原因图谱 | 数据
const reasonGetMore = async (reason) => {
    const {data: res} = await more('底事件', reason);
    state.data = res.data
    state.ids = []
    state.graphData = handleEchartsData(state.data)
}

// 故障报告图谱 | 数据
const reportGetMore = async (reportName) => {
    const {data: res} = await more('故障报告', reportName);
    state.data = res.data
    state.ids = []
    state.graphData = handleEchartsData(state.data)
}


onMounted(()=>{
  setTimeout(()=>{
    if(props.type === 'influence') {
      getInfluencePath()
    } else if (props.type === 'reason') {
      reasonGetMore(props.reason)
    } else {
      reportGetMore(props.reportName)
    }
  },300)
})

watch(()=>props.reason,(query)=>{
  if(query) {
    reasonGetMore(query)
  }
},{immediate:true})

// watch(()=>props.influenceReason,(query)=>{
//   if(query) {
//     getInfluencePath()
//   }
// },{immediate:true})

</script>
