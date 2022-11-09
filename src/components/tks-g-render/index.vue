<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch,
  defineProps,
  withDefaults,
  defineExpose,
  defineEmits,
  nextTick
} from "vue";
import {formatData} from "./dataFormat.js";
import cytoscape from "cytoscape";
import styleSheetList from "./styleSheetList";//修改节点及边的样式 可自定义类去覆盖
import {getAllInfoPathsHandler, getAllPath} from "./getAllPath.js";
import {showSinglePath, resetAllClass} from "./pathView.js";
import {addEvents, dbclickEvents, addClickEvents, mouseoverEvents, mouseoutEvents } from "./events.js";
import {getRelationPath} from "./getRelationPath.js"
import {api as fullscreen} from 'vue-fullscreen'
import png1 from './img/1.png'
import png2 from './img/2.png'
import png3 from './img/3.png'
import png4 from './img/4.png'
import png5 from './img/5.png'
import png6 from './img/6.png'
import png7 from './img/7.png'
import png8 from './img/8.png'
import png9 from './img/9.png'
import out from './img/out.png'
import './events.js'
import {makePy} from './translateZn-En.js'
import cise from 'cytoscape-cise'
import fcose from 'cytoscape-fcose'
import d3Force from 'cytoscape-d3-force';
// import dagre from 'cytoscape-dagre'
import md5 from 'md5'

cytoscape.use(d3Force);
// cytoscape.use(dagre)
cytoscape.use(cise)
cytoscape.use(fcose)

//定义组件传递的参数
const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      nodes: [],
      edges: []
    })
  },
  mainNode: {
    type: Number,
    default: () => 33
  },
  ids: {
    type: Array,
    default: () => []
  },
  paths: {
    type: Array,
    default: () => []
  },
  endPoints: {
    type: Array,
    default: () => []
  },
  // 以下两项都是路径发现使用
  pathIndex: {
    type: String
  },
  pathsData: {
    type: Array,
    default: () => []
  },
  isShowHeader: {
    type: Boolean,
    default: () => true
  },
  isAddEvents: {
    type: Boolean,
    default: () => true
  },
  isDbclickEvents: {
    type: Boolean,
    default: () => false
  },
  isCalcColors: {
    type: Boolean,
    default: () => false
  },
  // 有同时嵌套组件的情况
  mutilComponent: {
    type: Boolean,
    default: () => false
  },
  // 禁止点击的默认事件（一度关系等）
  stopDefaultEvents: {
    type: Boolean,
    default: () => false
  },
})
const emits = defineEmits(['getMoreDataFn'])
const sizePer = 20
const colors = [
  '#F6D2A8',
  '#ACE9C4',
  '#ABE8EC',
  '#A3DAF1',
  '#A6BBF2',
  '#EFC4BA',
  '#97CBF0',
  '#C7A1EC',
  '#E1ECA1',
  '#97B4E0',
  '#EDB6B6',
  '#F5DD9F',
  '#F6A8E0',
  '#CDEEB8',
  '#D0C3EC',
  '#82D9FF',
  '#EFF0BA',
  '#FFD2D2',
  '#D4FFD3',
  '#FFA4CA',
  '#B6DFD8',
  '#EFE6B8'
]
const borderColors = [
  '#C0751E',
  '#2AB662',
  '#25A4AC',
  '#2785AC',
  '#2C55BE',
  '#B04B34',
  '#2B71A5',
  '#642F99',
  '#819221',
  '#2B5AA0',
  '#A43737',
  '#9F7D23',
  '#A5538E',
  '#77A858',
  '#9A82CE',
  '#00B4FF',
  '#ADB007',
  '#9E5849',
  '#61B27D',
  '#B41591',
  '#66A499',
  '#A79D6A'
]
const state = reactive({
  paths: [],
  selectedPathId: -1,
  cy: null,
  layout: 'grid',
  types: [],
  typeColors: {},
  typeSizes: {},
  formattedData: {},
  currentType: '',
  currentNode: [],
  isFullScreen: false,
  graphWidth: 0,
  graphHeight: 0,
  style: {}
});

const activePath = computed(() => {
  if (state.selectedPathId === -1) {
    return [];
  }
  return state.paths[state.selectedPathId];
});

const allInfoPaths = computed(() =>
    getAllInfoPathsHandler(state.cy, state.paths)
);
const changeActivePathIndex = (index) => {
  state.selectedPathId = index;
};
//切换全屏
const fullscreenDom = ref(null)
const toggleFullscreen = async () => {
  await fullscreen.toggle(fullscreenDom.value, {
    pageOnly: true,
    teleport: false,
    callback: (isFullscreen) => {
      const parentNode = document.getElementsByClassName('tks-g-container')[0].parentNode
      if (!isFullscreen) {
        parentNode.style.width = state.graphWidth + 'px'
        parentNode.style.height = state.graphHeight + 'px'
        init()
      }
    },
  })
  state.isFullScreen = fullscreen.isFullscreen
  setTimeout(() => {
    init()
  }, 500)
}
const LayoutOptions = {
  'd3-force': {
    name: 'd3-force',
    animate: true,
    fixedAfterDragging: true,
    linkId: function id(d) {
      return d.id;
    },
    maxSimulationTime: 100,
    maxIterations: 1,
    linkDistance: 200,
    manyBodyStrength: -300,
    ready: function () {
    },
    stop: function () {
    },
    tick: function (progress) {
    },
    randomize: false,
    infinite: true
  }, 
  'grid': {
    name: 'grid',
    avoidOverlapPadding: 10,
    fit: true,
    boundingBox: {x1:10, y1:10, w: 1500, h: 800},
    avoidOverlap: true,
  }
}
//切换展示方式
const switchLayout = (layout) => {
  if (state.layout == layout) return
  state.layout = layout
  init(true)
}

const addNodesAndEdges = (data) => {
  state.cy.add(data)
}

//类型切换(点击Header类型标签时触发)
const handleTypeClick = (type) => {
  //取消选中状态
  if (state.currentType === type) {
    state.currentType = ''
    return
  }
  state.currentType = type
}

//颜色切换
const handleColorClick = (index) => {
  if (state.currentType !== '') {
    state.typeColors[state.currentType] = index
    if (!state.style[state.currentType]) state.style[state.currentType] = {}
    // state.style[state.currentType]["background-color"] = colors[state.typeColors[state.currentType]]
    state.style[state.currentType]["background-color"] = 'transparent'
    // state.style[state.currentType]["border-color"] = borderColors[state.typeColors[state.currentType]]
    state.style[state.currentType]["border-color"] = 'rgba(130, 255, 247, 1)'
    state.cy.$(`.${state.currentType}`).style({
      // "background-color": colors[state.typeColors[state.currentType]],
      // "border-color": borderColors[state.typeColors[state.currentType]],
      "background-color": 'transparent',
      "border-color": 'rgba(130, 255, 247, 1)',
    })
  }
}

//大小切换
const handleSizeClick = (i) => {
  if (state.currentType !== '') {
    state.typeSizes[state.currentType] = i
    if (!state.style[state.currentType]) state.style[state.currentType] = {}
    state.style[state.currentType]["width"] = i * sizePer
    state.style[state.currentType]["height"] = i * sizePer
    state.cy.$(`.${state.currentType}`).style({
      width: i * sizePer,
      height: i * sizePer,
    })
  }
}

// 程序通过事件驱动，根据selectedPathId的状态来更新渲染状态
watch(
    () => state.selectedPathId,
    () => {
      if (state.cy) {
        // state.cy.add({group: 'nodes', data: {id: 1001, name: "哈哈哈11"}})
        // switchLayout(state.layout)
        if (state.selectedPathId === -1) {
          resetAllClass(state.cy);
        } else {
          showSinglePath(state.cy, activePath.value);
        }
      }
    }
);

watch(() => props.data, (data) => {
  if (data.nodes && data.nodes.length) {
    setTimeout(() => {
      state.graphWidth = document.getElementsByClassName('tks-g-container')[0].parentNode.clientWidth
      state.graphHeight = document.getElementsByClassName('tks-g-container ')[0].parentNode.clientHeight
      init()
    }, 100);
    // 重置样式
    changeActivePathIndex(-1)
  } else {
    if (state.cy) state.cy.destroy()
  }
}, {deep: true})

watch(() => props.pathIndex, (value) => {
  PathRelationship()
}, {deep: true})

//一度关系发现
const OnceRelationship = () => {
  if (props.isAddEvents) {
    addEvents(state.cy, (nodes, cy, edge) => {
      if (props.stopDefaultEvents) return
      state.currentNode = []
      if (!nodes.length) {
        state.currentNode = []
      } else {
        if (edge) {
          // 点击关系
          nodes.map(node => state.currentNode.push(state.cy.$(`#${node}`).data()))
        } else {
          // 点击节点
          // state.currentNode.push(state.cy.$(`#${nodes[0]}`).data())
        }
      }
      getRelationPath(nodes, cy, true)
    });
    mouseoverEvents(state.cy, (nodes, cy, edge) => {
      if (props.stopDefaultEvents) return
      state.currentNode = []
      if (!nodes.length) {
        state.currentNode = []
      } else {
        // if (edge) {
        //   // 点击关系
        //   nodes.map(node => state.currentNode.push(state.cy.$(`#${node}`).data()))
        // } else {
          // 鼠标移入节点
          state.cy.$(`#${nodes[0]}`).addClass('full_name');
        // }
      }
    })

    mouseoutEvents(state.cy, (nodes, cy, edge) => {
      if (props.stopDefaultEvents) return
      state.currentNode = []
      if (!nodes.length) {
        state.currentNode = []
      } else {
          // 鼠标移出节点
          state.cy.$(`#${nodes[0]}`).removeClass('full_name');
      }
    })
    
  }
}

//两点路径发现
const TwoPointRelationship = () => {
  const findPathHandler = (path) => {
    if (!path || path.length === 0) {
      changeActivePathIndex(-1);
      return;
    }
    let pathId = state.paths.findIndex(
        (p) => p.join("-").indexOf(path.join("-")) !== -1
    );
    if (pathId === -1) {
      // 反向再查一查
      pathId = state.paths.findIndex(
          (p) => p.reverse().join("-").indexOf(path.join("-")) !== -1
      );
    }
    if (pathId !== -1) {
      changeActivePathIndex(pathId);
    }
  };
  addClickEvents(state.cy, findPathHandler)
  state.paths = getAllPath(state.cy, props.endPoints[0], props.endPoints[1]);
}
//两点路径发现
const PathRelationship = () => {
  const findPathHandler = (path) => {
    if (!path || path.length === 0) {
      changeActivePathIndex(-1);
      return;
    }
    let pathId = state.paths.findIndex(
        (p) => p.join("-").indexOf(path.join("-")) !== -1
    );
    if (pathId === -1) {
      // 反向再查一查
      pathId = state.paths.findIndex(
          (p) => p.reverse().join("-").indexOf(path.join("-")) !== -1
      );
    }
    if (pathId !== -1) {
      changeActivePathIndex(pathId);
    }
  };
  if (props.isAddEvents) {
    addEvents(state.cy, () => {
      changeActivePathIndex(-1)
    })
    // addEvents(state.cy, findPathHandler)
  }
  // state.paths = getAllPath(state.cy, props.endPoints[0], props.endPoints[1]);
  // 由前端生成的paths暂时没有顺序，先使用后端返回的paths
  let orderPaths = []
  props.pathsData.map(outArray => {
    orderPaths = []
    outArray.map((innerItem, index) => {
      if (index + 1 === outArray.length) {
        orderPaths.push(innerItem.startId)
        orderPaths.push(innerItem.endId)
      } else {
        orderPaths.push(innerItem.startId)
      }
    })
    state.paths.push(orderPaths)
  })
  // 根据路径长度不同展示不同高亮路线
  changeActivePathIndex(props.pathIndex)
}

const getCalcColorsStyle = (node, type) => {
  let style = {
    "background-color": node.style && node.style.nodeColor,
    "border-color": node.style && node.style.brColor,
    "border-width": 2,
    width: node.style && node.style.size,
    height: node.style && node.style.size
  }
  if (state.style[type]) {
    style = {...style, ...state.style[type]}
  }
  return style
}

const getStyle = (type) => {
  let style = {
    // "background-color": colors[state.typeColors[type]],
    // "border-color": borderColors[state.typeColors[type]],
    "background-color": 'rgba(9, 17, 30, 1)',
    "border-color": 'rgba(130, 255, 247, 1)',
    "border-width": 2,
    width: state.typeSizes[type] * sizePer,
    height: state.typeSizes[type] * sizePer
  }
  if (state.style[type]) {
    style = {...style, ...state.style[type]}
  }
  return style
}
const cyDom = ref(null)
const init = (forceInit) => {
  state.types = Array.from(new Set(props.data.nodes.map((node, index) => 'class' + md5(node.label))))
  // 判定是否由节点颜色生成/节点大小配置，且颜色只能为rgb
  if (props.isCalcColors) {
    props.data.nodes.map((node, index) => {
      const type = 'class' + md5(node.label)
      // if (labelEn.charCodeAt() > 255) labelEn = makePy(labelEn)[0].toLowerCase()
      let style = getCalcColorsStyle(node, type)
      const i = styleSheetList.findIndex(item => item.selector === type)
      if (i > -1) styleSheetList.splice(i, 1)
      //把以下内容加入到了styleSheetList中
      styleSheetList.push({
        selector: `.${type}`,
        style,
      })
    })
  } else {
    let i = 0
    state.types.forEach((type, index) => {
      if (typeof state.typeColors[type] === "undefined") {
        state.typeSizes[type] = 2
        if (i > colors.length - 1) i = 0
        state.typeColors[type] = i
        i++
        styleSheetList.push({
          selector: `.${type}`,
          style: {
            "background-color": 'rgba(9, 17, 30, 1)',
            "border-color": 'rgba(130, 255, 247, 1)',
            // "background-color": colors[state.typeColors[type]],
            // "border-color": borderColors[state.typeColors[type]],
            "border-width": 2,
            // width: state.typeSizes[type] * sizePer,
            // height: state.typeSizes[type] * sizePer
            // 节点圆圈的大小
            width: 80,
            height: 80
          },
        })
      } else {
        const index = styleSheetList.findIndex(item => item.selector === type)
        if (index > -1) styleSheetList.splice(index, 1)
        let style = getStyle(type)
        styleSheetList.push({
          selector: `.${type}`,
          style,
        })
      }
    })
  }
  // 同类label的个数
  let labelArr = [], domElement = null
  props.data.nodes.map(node => labelArr.push(node.label))
  state.types = getArrItemNum(labelArr)
  state.formattedData = formatData(props.data, props.endPoints);
  let layout = {    //指定布局的选项。
    name: props.layout || state.layout,
    minNodeSpacing: 100,
    animate: true,
  }
  if (state.layout === 'd3-force') {
    layout = LayoutOptions['d3-force']
  }
  // if (props.ids.length && !forceInit) {
  //   layout = LayoutOptions['grid']
  // }
  state.cy = cytoscape({
    container: cyDom.value,  //应该呈现图形的HTML DOM元素。
    // elements: state.formattedData,  //指定节点和路径数据的选项。
    elements: state.formattedData,  //指定节点和路径数据的选项。
    zoom: 1,    // 初始化视口状态：1:图的初始缩放级别。
    style: styleSheetList,   //指定样式的选项。
    layout,
    userPanningEnabled: false,
    userZoomingEnabled: false,
  });

  if (!props.paths.length) {
    setTimeout(() => {
      state.cy.center()
    }, 300)
    OnceRelationship()
  }

  // if (props.endPoints && props.endPoints.length) {
  //   TwoPointRelationship()
  // }
  if (props.isDbclickEvents) {
    dbclickEvents(state.cy, (data) => {
      emits('getMoreDataFn', data)
    })
  }

  if (props.mainNode) {
    //获取canvas矩阵
    const extent = state.cy.extent()
    // const per = extent.w / props.paths.length
    // props.paths.forEach((id, index) => {
      const node = state.cy.$id(props.mainNode)
      node.position({x: 160, y: extent.y1 + extent.h / 2}).lock().style({
        // 这里让后端传参带过来
        width: 100,
        height: 100
      })
      props.ids.forEach((id, index) => {
        if(id !== props.mainNode) {
          const node = state.cy.$id(id)
          node.position({x: (400 + parseInt(index/5) * 200), y: extent.y1 + (index % 5) * 130 + 110} ).lock().style({
            width: 80,
            height: 80
          })
        }
      })

      // node.neighborhood().edges().forEach(edge => {
      //   if(props.paths.includes(edge.target().id()) && props.paths.includes(edge.source().id())){
      //     edge.addClass("path-edge").removeClass("edge")    // 这里加的类名是主线各个点之间关系线的样式
      //   }
      // })
    // })
    // addEvents(state.cy, (nodes, cy, edge) => {
    //   if (props.stopDefaultEvents) return
    //   state.currentNode = []
    //   if (!nodes.length) {
    //     state.currentNode = []
    //   } else {
    //     if (edge) {
    //       // 点击关系
    //       nodes.map(node => state.currentNode.push(state.cy.$(`#${node}`).data()))
    //     } else {
    //       // 点击节点
    //       state.currentNode.push(state.cy.$(`#${nodes[0]}`).data())
    //     }
    //   }
    // });
  }
}
const getArrItemNum = (arr) => {
  let ArrObj = [];
  arr.sort();
  arr.forEach((element, index) => {
    if (element === arr[index - 1]) {
      ArrObj[ArrObj.length - 1].num++;
    } else {
      ArrObj.push({
        key: element,
        class: 'class' + md5(element),
        num: 1
      });
    }
  });
  return ArrObj
}
onMounted(() => {
  state.graphWidth = document.getElementsByClassName('tks-g-container')[0].parentNode.clientWidth
  state.graphHeight = document.getElementsByClassName('tks-g-container')[0].parentNode.clientHeight
});


defineExpose({
  state,
  init,
  switchLayout,
  addNodesAndEdges,
  getArrItemNum
})

</script>

<template>
  <div class="tks-g-container fullscreen-wrapper" ref="fullscreenDom">
    <!--
      上方颜色标签按钮区域
     -->
    <div class="tks-g-head" v-if="props.isShowHeader">
      <div class="tks_box">
          <span v-for="(type,index) in state.types" class="type" :key="index"
                :style="`background:${colors[state.typeColors[type.class]]};border-color:${borderColors[state.typeColors[type.class]]};color:${borderColors[state.typeColors[type.class]]}`"
                :class="{'active':state.currentType === type.class}"
                @click="handleTypeClick(type.class)"
          >
          {{ type.key }}({{ type.num }})</span>
      </div>
      <!--
        切换展示形式
       -->
      <div class="tks_box" v-if="state.types.length" style="width: 240px">
        <img :src="png1" class="img" @click="switchLayout('breadthfirst')">
        <img :src="png2" class="img" @click="switchLayout('grid')">
        <img :src="png3" class="img" @click="switchLayout('concentric')">
        <img :src="png5" class="img" @click="switchLayout('circle')">
        <img :src="png9" class="img" @click="switchLayout('d3-force')">
        <img :src="png8" class="img" @click="switchLayout('fcose')">
        <img :src="png4" class="img" @click="switchLayout('random')">
        <img :src="state.isFullScreen ? out : png6" class="img" @click="toggleFullscreen">
      </div>
    </div>

    <!--
      主图区域
     -->
    <div id="cy" ref="cyDom" class="cy" v-if="!mutilComponent || (props.data.nodes && props.data.nodes.length)"></div>

    <!--
      下方按钮区域(点击本体圆圈后下方出现的修改颜色和大小)
     -->
    <div class="tks-g-foot" v-if="state.currentType">
      <div class="tks_box">
        <p>颜色：</p>
        <div class="tks_box">
          <span v-for="(color,index) in colors" class="color"
                :style="`background:${color};border-color:${borderColors[index]}`" :key="index" :class="{'active':state.typeColors[state.currentType] ===
                index}" @click="handleColorClick(index)"></span>
        </div>
      </div>
      <div class="tks_box">
        <p>大小：</p>
        <div class="tks_box">
          <span v-for="i in 4" class="color size" :style="`width:${(i+5)*2}px;height:${(i+5)*2}px`" :key="i"
                @click="handleSizeClick(i)" :class="{ 'active': state.typeSizes[state.currentType] === i }"></span>
        </div>
      </div>
    </div>

    <!--
      点击本体圆圈后,右侧弹框部分
    -->
    <div class="tks-g-drawer" v-if="state.currentNode.length">
      <div v-for="(property, index) in state.currentNode" :key="index">
        <div class="tks-g-drawer-title" style="color: #fff;">实体属性</div>
        <div class="mt5">
          <span style="color: #fff;">概念本体：</span>
          <span style="color: #c7dcef;">{{ property.label }}</span>
        </div>
        <div class="tks-g-drawer-name">{{ property.name || property.type }} </div>
        <div v-if="property.properties">
          <div v-for="key in Object.keys(property.properties)" :key="key">
            <span class="name" style="color: #fff;">{{ key }}：</span>
            <span class="value" style="color: #c7dcef;">{{ property.properties[key] }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.fullscreen-wrapper {
  background-color: #fff;
  z-index: 100
}

.tks-g-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 90%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 5px;
}

.tks-g-head {
  width: 100%;
  pointer-events: none;
  position: absolute;
  top: 5px;
  left: 5px;
  width: calc(100% - 10px);
  height: 24px;
  z-index: 100;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
}

.tks-g-foot {
  pointer-events: none;
  position: absolute;
  bottom: 5px;
  left: 5px;
  width: calc(100% - 10px);
  height: 22px;
  z-index: 100;
  background-color: transparent;
  display: flex;
}

.tks_box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.box ~ .box {
  margin-left: 10px;
}

.color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: auto;
  cursor: pointer;
  margin: 0 5px;
  border-style: solid;
  border-width: 0;
  display: flex;
  align-items: center;
}

.color.active, .type.active {
  border-width: 2px;
}

.img {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  cursor: pointer;
  pointer-events: auto;
}

.size {
  background-color: #CED4DA;
}

.size.active {
  background-color: #8A92A0;
  border-width: 0
}

.type {
  border-radius: 40px 40px 40px 40px;
  padding: 3px 10px;
  margin: 5px;
  pointer-events: auto;
  cursor: pointer;
  border-style: solid;
  border-width: 0;
  display: flex;
  align-items: center;
}

.tks-g-drawer {
  background: #0E1A2F;
  box-shadow: -2px 0px 51px 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px 4px 4px 4px;
  width: 270px;
  height: 89%;
  line-height: 16px;;
  position: absolute;
  z-index: 102;
  right: 0;
  padding: 3px 20px;
  box-sizing: border-box;
  overflow: hidden auto;
    &::-webkit-scrollbar { // chrome safari
    display: none;
  }
}

.tks-g-drawer::before {
  content: " ";
  /* background-color: rgba(255, 255, 255, 0.6); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  top: 0;
  width: 270px;
  height: 100%;
  position: absolute;
  right: 0;
  filter: blur(2px);
}

.tks-g-drawer-title {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}

.tks-g-drawer-name {
  padding: 2px 8px;
  background: rgba(22, 119, 255, 0.2500);
  border-radius: 2px 2px 2px 2px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(130, 255, 247, 1);
  margin: 10px 0;
  display: inline-block;
}

.name {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
}

.value {
  font-size: 14px;
  font-weight: 400;
  color: #8A92A0;
}

.info-area {
  width: 20vw;
}

.path {
  cursor: pointer;
}

.path.active {
  background-color: red;
}

#cy {
  width: 100%;
  height: 100%;
}

</style>
