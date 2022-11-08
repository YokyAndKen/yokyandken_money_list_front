<template>
  <div
    class="relation-tree"
    ref="relationTree"
  ></div>
</template>

<script setup>

import G6 from '@antv/g6';
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
  data: {
    type:Array, 
    default:() => {}
  }
})

const relationTree = ref(null)
const state = reactive({
  data:props.data 
})

/**
 * format the string
 * @param {string} str The origin string
 * @param {number} maxWidth max width
 * @param {number} fontSize font size
 * @return {string} the processed result
 */
const fittingString = (str, maxWidth, fontSize) => {
  const ellipsis = "...";
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
  let currentWidth = 0;
  let res = str;
  const pattern = new RegExp("[\u4E00-\u9FA5]+"); // distinguish the Chinese charactors and letters
  str.split("").forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return;
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize;
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize);
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`;
    }
  });
  return res;
};

watch(() => props.data, (val) => {
  state.data = val
}, { deep: true }, { immediate: true })

onMounted(()=>{
  setTimeout(() => {
    const graph = new G6.Graph({
      container: relationTree.value,
      fitView: true,
      fitViewPadding: 30,
      animate: true,
      groupByTypes: false,
      modes: {
        default: [
          "drag-canvas",
          "zoom-canvas",
          // "click-select",
          "drag-node",
          // "drag-canvas"
        ]
      },
      layout: {
        type: 'dagre',
        // sortByCombo: false,
        ranksep: 70,
        nodesep: 20,
      },
      defaultNode: {
        size: [400, 200],
        type: 'copy-node',
        anchorPoints: [[0.5, 0], [0.5, 1]],
        style: {
            fill: 'rgba(84,133,227,0.3)', // 节点填充色
            stroke: '#5485E3', // 节点描边色
            lineWidth: 3, // 节点描边粗细
          },
        labelCfg:{
          style: {
            fill: '#FFFFFF', // 节点标签文字颜色
            fontSize: 30,
          },
        }
      },
      defaultEdge: {
        type: 'line',
        style: {
          fill: '#FFFFFF', // 节点填充色
          stroke: '#FFFFFF', // 节点描边色
          lineWidth: 2, // 节点描边粗细
        },
        labelCfg:{
          style: {
            fill: '#2ACFE2', // 节点标签文字颜色
            fontSize: 20,
          },
        }
      },
    });

const nodeHeight = 200;
const nodeWidth = 400;
const fillColor = "rgba(84,133,227,0.3)";
const fontColor = "#5485E3";
const padding = 7;

G6.registerNode(
  "copy-node",
  {
    drawShape: function drawShape(cfg, group) {
      const rect = group.addShape("rect", {
        attrs: {
          x: 0,
          y: 0,
          height: nodeHeight,
          width: nodeWidth,
          fill: fillColor,
          stroke: fontColor,
          lineWidth: 2,
          radius: 5,
        }
      });

      // 上部文字区域
      const topGroup = group.addGroup({
        name: "top-group"
      });
      // 下部文字区域
      const bottomGroup = group.addGroup({
        name: "bottom-group"
      });

      bottomGroup.addShape("text", {
        attrs: {
          text: fittingString(cfg.bottomText, nodeWidth - 10, 25),
          x: 0.5 * nodeWidth,
          y: nodeHeight - (0.5 * nodeHeight + padding) * 0.8,
          fontSize: 24,
          textAlign: "center",
          textBaseline: "middle",
          shadowColor: fontColor,
          fill: fontColor,
        },
        name: "bottom-text"
      });

      bottomGroup.addShape("image", {
        attrs: {
          x: 5,
          y: 0.5 * nodeHeight + 8,
          height: 20,
          width: 20,
          opacity: 0,
          cursor: "pointer",
        },
        name: "bottom-copy-img"
      });

      return rect;
    },
    setState(name, value, item) {
      const group = item.get("group");
      const model = item.get("model");
      const { topText, bottomText } = model;

      if (name === "top-group-active") {
        const img = group.find((e) => e.get("name") === "top-copy-img");
        img.attr({
          opacity: value ? 1 : 0
        });

        const text = group.find((e) => e.get("name") === "top-text");
        // 区域是否够长 ? 居中， 展示内容不变 : 左对其， 展示完整
        const cutStr = fittingString(topText, nodeWidth - padding * 2 - 10, 25);
        if (cutStr === topText) {
          text.attr({
            fontWeight: value ? 800 : 700,
            shadowBlur: value ? 12.2 : 0,
            text: value
              ? topText
              : fittingString(topText, nodeWidth - padding * 2 - 10, 25)
          });
        } else {
          text.attr({
            fontWeight: value ? 800 : 700,
            x: value ? padding + 30 : 0.5 * nodeWidth,
            shadowBlur: value ? 12.2 : 0,
            textAlign: value ? "left" : "center",
            text: value
              ? topText
              : fittingString(topText, nodeWidth - padding * 2 - 10, 25)
          });
        }
      }

      if (name === "bottom-group-active") {
        const img = group.find((e) => e.get("name") === "bottom-copy-img");
        img.attr({
          opacity: value ? 1 : 0
        });

        const text = group.find((e) => e.get("name") === "bottom-text");
        const cutStr = fittingString(bottomText, nodeWidth - 10, 25);

        if (cutStr === bottomText) {
          text.attr({
            fontWeight: value ? 800 : 700,
            shadowBlur: value ? 12.2 : 0,
            text: value
              ? bottomText
              : fittingString(bottomText, nodeWidth - 10, 25)
          });
        } else {
          text.attr({
            fontWeight: value ? 800 : 700,
            x: value ? 30 : 0.5 * nodeWidth,
            shadowBlur: value ? 12.2 : 0,
            textAlign: value ? "left" : "center",
            text: value
              ? bottomText
              : fittingString(bottomText, nodeWidth - 10, 25)
          });
        }
      }
    }
  },
  "single-node"
);

graph.on("top-group:mouseenter", (e) => {
  graph.setItemState(e.item, "top-group-active", true);
});
graph.on("top-group:mouseleave", (e) => {
  graph.setItemState(e.item, "top-group-active", false);
});
graph.on("bottom-group:mouseenter", (e) => {
  graph.setItemState(e.item, "bottom-group-active", true);
});
graph.on("bottom-group:mouseleave", (e) => {
  graph.setItemState(e.item, "bottom-group-active", false);
});

    graph.data(state.data);
    graph.render(); 
  }, 500);
})


</script>

<style scoped lang="scss">
.relation-tree {
  width: 100%;
  height: 70vh;
}
</style>
