<!-- 404 -->
<template>
  <div class="notFoundPage">
    <div>
      <img src="@/assets/404.png" alt="not found">
      <p>访问的页面不存在</p>
      <el-button type="primary" @click="returnPage('index')">返回首页</el-button>
      <el-button type="primary" @click="returnPage('prev')">返回上一页</el-button>
    </div>
  </div>
</template>

<script lang='ts'>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'not found page',
  setup() {
    const router = useRouter()
    const state = reactive({
      
    })
    const returnPage = (type: string) => {
      if (type === 'index') {
        router.push('/')
      } else if (type === 'prev') {
        router.go(-1)
      }
    }
    onBeforeMount(() => {

    })
    onMounted(() => {

    })
    return {
      ...toRefs(state),
      returnPage
    }
  }
}
</script>
<style lang='scss' scoped>
.notFoundPage {
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>