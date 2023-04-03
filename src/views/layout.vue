<template>
  <div class="container">
    <div class="header flex">
      <div class="router_btn cup" v-for="nav in state.sides" @click="navTo(nav.path, index)" >
        <span class="text_title" :style="router.currentRoute.value.name === nav.name ? 'color: #fff;border-bottom: 3px solid #fff' : ''">{{nav.meta.title}}</span>
      </div>
      <div class="times">{{state.time}}</div>
      <div class="date flex">
        <div>{{state.weekName}}</div>
        <div style="margin-left: 5px;">{{state.date}}</div>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount} from "vue";
import { getAssetsFile } from '@/utils/getAssetsFile.ts'
import { useRouter,useRoute } from 'vue-router'
import { staticRoutes } from '@/router/index'
import { mainStore } from "@/store/index";

const router = useRouter()
const route = useRoute()
const store = mainStore();

const state = reactive({
  time: "",
  timer: null,
  date: '',
  weekName: '',
  sides: [],
});

const navTo = (routeStr, idx) => {
  router.push(routeStr)
}

const nowTime = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  let week = date.getDay();
  switch(week){
    case 0:
    state.weekName="Sun.";
    break;
    case 1:
    state.weekName="Mon.";
    break;
    case 2:
    state.weekName="Tue.";
    break;
    case 3:
    state.weekName="Wed.";
    break;
    case 4:
    state.weekName="Thu.";
    break;
    case 5:
    state.weekName="Fri.";
    break;
    default:
    state.weekName="Sat.";
  }
  state.time =
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  state.date = 
    year +
    "/" +
    month +
    "/" +
    day +
    " " ;
};
const showTime = () => {
  state.timer = setInterval(() => {
    nowTime();
  }, 1000);
};

onMounted(() => {
  showTime();
  staticRoutes.map(item => {
    item.isActive = false
    state.sides.push(item)
  })
});

onBeforeUnmount(() => {
  if (state.timer) {
    clearInterval(state.timer);
  }
});
</script>

<style scoped lang='scss'>
.container {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100vh;
  background: #333;
  color: #fff;
  .header {
    width: 100%;margin-top: 10px;
    height: 40px;
    padding-bottom: 10px;
    border-bottom: 1px solid grey;
  }  
  .content {
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 110px);
    padding: 15px;
  }
  .router_btn {
    width: 80px;padding: 10px;text-align: center;
  }
}
.times {
  position: absolute;
  top: 2px;
  right: 30px;
  font-family: DINPro-Bold, DINPro;
  font-size: 26px;
  line-height: 35px;
  font-weight: bold;
  color: #CFD3DC;
}
.date {
  position: absolute;
  top: 35px;
  right: 30px;
  font-size: 14px;
  font-family: DINPro-Bold, DINPro;
  line-height: 14px;
  color: #CFD3DC;
  div {
    &:first-child {
      margin-bottom: 5px;
    }
  }
}

</style>