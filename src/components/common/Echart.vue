<template>
  <div ref="echartsRef" class="echartsBox"></div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts/core';
  import { ref,reactive, onMounted, useSlots, watch } from 'vue'
  const slots = useSlots()
  import {
    BarChart,
    // 系列类型的定义后缀都为 SeriesOption
    BarSeriesOption,
    LineChart,
    LineSeriesOption,
    PieChart 
  } from 'echarts/charts';
  import {
    TitleComponent,
    // 组件类型的定义后缀都为 ComponentOption
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    // 数据集组件
    DatasetComponent,
    DatasetComponentOption,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent,
    // 图例
    LegendComponent,
    // 下载、查看等相关功能
    ToolboxComponent,
  } from 'echarts/components';
  import { LabelLayout, UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';
  import 'echarts/lib/component/markLine'
  // 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
  type ECOption = echarts.ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
  >;

  // 注册必须的组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LineChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    LegendComponent,
    ToolboxComponent,
    PieChart
  ]);

  /**
   * @Params :echartType--->图类型
   * @Params :echartData--->图的数据的配置
   * @Params :echartOption--->图option的配置
   */
  const props = defineProps({
    echartType: String,
    echartData: Object,
  })

  let echartDom = null;//解决vue3中toolTip不显示问题
  const echartsRef = ref(null)

  const state = reactive({
    title:"",
    option: {}
  })

  const initInstance = () => {
    echartDom = echarts.init(echartsRef.value)
    echartDom.setOption(state.option)
  }

  const initOption = () => {
    let title = slots.default && slots.default()[0].children 
    state.option = {}  
    let series = []
    switch(props.echartType) {
      case 'line': {
        for(let name in props.echartData.yAxis) {
          series.push({
            // name,
            type: 'line',
            areaStyle: {},
            markLine: {
              symbol:['none','none'],
              lineStyle:{
                type:'solid',
                color:'red'
              },
              data:[
                {
                  yAxis: props.echartData.datumLine.min,
                  // label: {
                  //   position:'start',
                  //   formatter:"最小值",
                  //   fontSize: 10
                  // },
                  // tooltip: {
                  //   trigger: 'axis',
                  // }
                },
                {
                  yAxis: props.echartData.datumLine.max,
                  // label: {
                  //   position:'start',
                  //   formatter:"最大值",
                  //   fontSize: 10
                  // },
                  // tooltip: {
                  //   trigger: 'axis',
                  // }
                }
              ]
            },
            data: props.echartData.yAxis[name],
          })
        }
        state.option = {
          title: {
            text: title || '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: (e) => {
              if(e.componentType === "series") {
                return `时间：${e.name}<br/> 
                        值：${e.value}`
              } else {
                return e.value === props.echartData.datumLine.min ? `最小值：${e.value}` : `最大值：${e.value}` 
              }
            }
          },
          legend: {
            // data: props.echartData.xAxis
          },
          grid: {
            top:'8%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.echartData.xAxis
          },
          yAxis: {
            type: 'value'
          },
          series
        }
      }
      break;
    }
  }

onMounted(()=>{
  window.addEventListener('resize', () => {
    if (echartDom) echartDom.resize()
  })
})

watch(()=>props.echartData,()=>{
  props.echartData ? initOption() : null
  initInstance()
},{
  deep:true
})

</script>


<style scoped lang="scss">
  .echartsBox {
    width: 100%;
    height: 100%;
  }
</style>

