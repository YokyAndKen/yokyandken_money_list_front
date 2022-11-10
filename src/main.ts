import { createApp } from 'vue'
import locale from "element-plus/lib/locale/lang/zh-cn";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/style/common.scss'
import App from './App.vue'
import router from './router'

import mitt from 'mitt'



const app = createApp(App)
app.use(router)
app.use(ElementPlus, { locale })
app.mount('#app')

app.config.globalProperties.emitter = mitt()