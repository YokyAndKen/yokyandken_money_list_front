<template>
  <div
    class="relation-tree"
    ref="relationTree"
    :style="`width:${state.chartWidth}px;height:${state.chartHeight}px;`"
  ></div>
</template>

<script setup lang="ts">
import { reactive, onMounted, defineProps, watch, ref, onBeforeUnmount, nextTick } from 'vue'

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入柱状图图表，图表后缀都为 Chart
import { TreeChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  TreeChart,
  CanvasRenderer,
  LegendComponent,
]);


const baseLabel = {
  fontSize: 12,
  lineHeight: 36,
  borderWidth: 2,
  padding: 8,
  borderRadius: 24,
  align: 'center',
  overflow: 'breakAll',
  backgroundColor: 'rgba(84,133,227,0.3)',
  borderColor: '#5485E3',
  color: "#FFFFFF",
}
const lineLabel = {
  fontSize: 14,
  color: '#FFFFFF',
  offset: [20, 0]
}

const data = [{
  name: '名称名称',
  label: baseLabel,
  children: [
    {
      name: '50%',
      label: lineLabel,
      symbol: 'triangle',// 三角形作为箭头
      children: [
        {
          name: '公司',
          label: baseLabel,
          children:[
            {
              name: '公司',
              label: baseLabel,
            },
            {
              name: '公司',
              label: baseLabel,
            }
          ]
        }
      ]
    },
    {
      name: '50%',
      label: lineLabel,
      symbol: 'triangle',// 三角形作为箭头
      children: [
        {
          name: '公司',
          label: baseLabel
        },{
          name: '公司',
          label: baseLabel
        },{
          name: '公司',
          label: baseLabel
        },{
          name: '公司',
          label: baseLabel
        }
      ]
    },
    {
      name: '50%',
      label: lineLabel,
      symbol: 'triangle',// 三角形作为箭头
      children: [
        {
          name: '项目',
          label: baseLabel
        },
        {
          name: '公司',
          label: baseLabel
        },
        {
          name: '公司',
          label: baseLabel,
          children:[
            {
              name: '公司',
              label: baseLabel
            },
            {
              name: '公司',
              label: baseLabel,
              children:[
                {
                  name: '公司',
                  label: baseLabel
                },
                {
                  name: '公司',
                  label: baseLabel
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}]


const relationTree = ref(null)
const props = defineProps({
  width:{
    type: Number,
    default: 800
  },
  height:{
    type: Number,
    default: 800
  },
  data: {
    type:Array, 
    default:() => []
  }
})
const emits = defineEmits(['redirect'])

const state = reactive({
  chartWidth: 800,
  chartHeight: 800, 
  myChart: null,
  data:data
})



const resize = () => {
  if (!state.data) return;
  let elesArr = Array.from(
    new Set(state.myChart._chartsViews[0]._data._graphicEls)
  );
  let dep = state.myChart._chartsViews[0]._data.tree.root.height; // 获取树高
  const LAYER_HEIGHT = 80;/**垂直每个结点的之间间距 */
  const LAYER_WIDTH = 400;/**水平每个结点的之间间距 */
  const MIN = 1500;
  let currentHeight = LAYER_HEIGHT * (dep + 1) || LAYER_HEIGHT;
  let newHeight = Math.max(currentHeight, LAYER_HEIGHT);
  state.chartHeight = newHeight;
  let currentWidth = LAYER_WIDTH * (elesArr.length - 1) || LAYER_WIDTH;
  let newWidth = Math.min(Math.max(Math.max(currentWidth, LAYER_WIDTH), MIN), 1200);/**1200指的盒子宽度 */
  state.chartWidth = newWidth;
  window.setTimeout(() => {
    state.myChart.resize();
    emits("redirect");
  }, 0);
}

const option = () => {
  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: series(),
  };
}

const series = () => {
  return [{
    type: 'tree',
    orient: 'vertical',
    width: 1000,
    // roam: 'move',
    left: 'center',
    symbolRotate: -180, // 箭头顺时针旋转90度
    itemStyle: { color: '#ddd', borderWidth: 0 },
    lineStyle: { color: '#AEBFD7', curveness: 0.5 },
    expandAndCollapse: false,
    data: state.data,
  }];
}

watch(()=>props.data,() => {
  nextTick(() => {
    if (state.myChart) {
      state.myChart.setOption(state.option);
      resize();
    }
  });
})




onMounted(()=>{
  state.myChart = echarts.init(relationTree.value);
  state.myChart.setOption(option());
  resize();

  state.myChart.on("click", (params) => {
    // 控制台打印数据的名称
      resize();
  });
  if (state.data && state.data.length) {
    state.myChart.setOption(option());
  }

})



</script>

<style scoped lang="scss">

</style>