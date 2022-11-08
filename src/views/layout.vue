<template>
  <div class="container">
    <div class="header cup">
      <div>
        <div class="times">{{state.time}}</div>
        <div class="date flex">
          <div>{{state.weekName}}</div>
          <div style="margin-left: 5px;">{{state.date}}</div>
        </div>
      </div>
      
      <img @click="router.push('/')" :src="getAssetsFile('title.png')" alt="title" v-if="router.currentRoute.value.name!=='index'">
      <div class="header_right">
        <div class="header_up cup" @click="showWarning"><div><span>故障预警</span><img :class="state.isShowWarning ? 'helpTips':''" :src="state.isShowWarning ? getAssetsFile('bell_s.png') : getAssetsFile('bell.png')" alt=""></div></div>
        <ul class="header_down" v-show="state.isShowWarning">
          <li class="cup gradualClass" v-if="state.isShowSelectWarning" v-for="(item,index) in 1" :key="item" @click="showWarningDialog(item)">
            <div class="li_header">
              <div class="warning"><img :src="getAssetsFile('icon_tips.png')" alt=""><span>故障预警</span></div>
              <p class="ignore cup" @click.stop="showSelectWarning(index)">忽略</p>
            </div>
            <p>OA星被分流器壳温持续升高，即将超阈值</p>
            <div class="li_down"> 
              <span>2022-01-23  15:00:23</span>
              <div>北分流器</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </div>
    <WarningDialog v-if="state.isShowWarningDialog" @sendCloseDialog="getCloseDialog"></WarningDialog>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted, onBeforeUnmount} from "vue";
import { getAssetsFile } from '@/utils/getAssetsFile.ts'
import WarningDialog from '@/components/common/WarningDialog.vue'
import { useRouter,useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const state = reactive({
  time: "",
  timer: null,
  date: '',
  weekName: '',
  isShowWarning: true,
  isShowSelectWarning: true,
  isShowWarningDialog: false,
});
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
const showWarning = () => {
  state.isShowWarning = false
  state.isShowWarningDialog = true
}

// 实现渐变弹出 弹进
const gradual = () => {
  // test
  var Div = document.querySelector(".gradualClass");
  Div.style.right = "-500px";
  // console.log(Div);
}

const showSelectWarning = (index) => {
  gradual()
  // state.isShowSelectWarning = false
  var Div = document.querySelector(".helpTips");
  Div.className = '';
}
const showWarningDialog = (item) => {
  state.isShowWarningDialog = true
  state.isShowWarning = false
}
const getCloseDialog = (val) => {
  state.isShowWarningDialog = val
}
onMounted(() => {
  showTime();
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
  background: url('../assets/bg.png') no-repeat center;
  background-size:100% 100%;
  background-attachment:fixed;
  .header {
    width: 100%;
    height: 80px;
    img {
      margin-top: -13px;
      width: 100%;
      height: 100px;
    }
  }  
  .header_right {
    z-index: 88889 ;
    width: 370px;
    position: absolute;
    right: 40px;
    top: 32px;
    .header_up {
      width: 100%;
      height: 30px;
      position: relative;
      div {
        position: absolute;
        right: 0;
        width: 100px;
        text-align: center;
        padding: 3px 0;
        background: rgba(255,255,255,0.1);
        img {
          width: 20px;
          height: 20px;
          // vertical-align: middle;
          margin: auto 0;
        }
        span {
          display: inline-block;
          line-height: 20px;
          font-size: 16px;
          font-weight: 800;
          color: #fff;
        }
      }
    }
    .header_down {
      width: 100%;
      height: 100%;
      position: relative;
      li {
        position: absolute;
        top: 0px;
        right: 0px;
        transition: right linear 0.5s;
        overflow: hidden;
        margin-bottom: 3px;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        padding: 10px;
        width: 100%;
        height: 90px;
        background: rgba(123,35,29,0.5);
        backdrop-filter: blur(20px);
        box-shadow: 0px 4px 4px 0px rgba(0,0,0,0.25);
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #B03535;
        .li_header {
          width: 100%;
          height: 20px;
          display: flex;
          justify-content: space-between;
          .warning {
            img {
              width: 20px;
              height: 20px;
              margin:0;
            }
            span {
              vertical-align: middle;
              padding-left: 5px;
            }
          }
          .ignore {
            display: block;
            width: 60px;
            height: 20px;
            font-size: 12px;
            border: 1px solid #E06161;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;
            line-height: 20px;
            text-align: center;
          }
        }
        p {
          width: 100%;
          height: 10px;
          font-size: 14px;
          color: #C7DCEF;
          line-height: 22px;
          margin: 16px 0;
        }
        .li_down {
          width: 100%;
          height: 25px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #C7DCEF;
          span {
            line-height: 25px;
          }
          div {
            width: 60px;
            height: 19px;
            border: 1px solid #FFFFFF;
            line-height: 20px;
            text-align: center;
            padding: 3px;
            border-radius: 2px;
          }
        }
      }
    }
  }
  .content {
    overflow: hidden;
    width: 100%;
    // height: calc(100vh - 110px);
    // padding: 70px 8px 40px 8px;
  }
}
.times {
  position: absolute;
  top: 15px;
  left: 30px;
  color: #fff;
  font-family: DINPro-Bold, DINPro;
  font-size: 26px;
  line-height: 35px;
  font-weight: bold;
}
.date {
  position: absolute;
  top: 50px;
  left: 30px;
  font-size: 14px;
  font-family: DINPro-Bold, DINPro;
  color: rgba(255, 255, 255, 0.5);
  line-height: 14px;
  div {
    &:first-child {
      margin-bottom: 5px;
    }
  }
}



.helpTips {
  animation-name: upAnimation;
  transform-origin: center top;
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
  animation-delay: .5s;
}
@keyframes upAnimation
  {
      0% {
          transform: rotate(0deg);
          transition-timing-function: cubic-bezier(0.215,.61,.355,1);
      }
      10% {
          transform: rotate(-12deg);
          transition-timing-function: cubic-bezier(0.215,.61,.355,1);
      }
      20% {
          transform: rotate(12deg);
          transition-timing-function: cubic-bezier(0.215,.61,.355,1);
      }
      28% {
          transform: rotate(-10deg);
          transition-timing-function: cubic-bezier(0.215,.61,.355,1);
      }
      36% {
          transform: rotate(10deg);
          transition-timing-function: cubic-bezier(0.755,.5,.855,.06);
      }
      42% {
          transform: rotate(-8deg);
          transition-timing-function: cubic-bezier(0.755,.5,.855,.06);
      }
      48% {
          transform: rotate(8deg);
          transition-timing-function: cubic-bezier(0.755,.5,.855,.06);
      }
      52% {
          transform: rotate(-4deg);
          transition-timing-function: cubic-bezier(0.755,.5,.855,.06);
      }
      56% {
          transform: rotate(4deg);
          transition-timing-function: cubic-bezier(0.755,.5,.855,.06);
      }
      60% {
          transform: rotate(0deg);
          transition-timing-function: cubic-bezier(0.755,.5,.855,.06);
      }
      100% {
          transform: rotate(0deg);
          transition-timing-function: cubic-bezier(0.215,.61,.355,1);
      }
  }

</style>