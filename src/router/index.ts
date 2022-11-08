import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'

const staticRoutes = [
  // { path: '/', name: 'index', meta: {title: '首页', icon: 'index'},  component: () => import('@/views/index.vue') },
  // { path: '/trouble', name: 'trouble', meta: {title: '故障检索', icon: 'index'},  component: () => import('@/views/trouble.vue') },
  // { path: '/report', name: 'report', meta: {title: '报告检索', icon: 'index', keepAlive: true},  component: () => import('@/views/report.vue') },
  // { path: '/detail', name: 'detail', meta: {title: '报告详情', icon: 'index'},  component: () => import('@/views/detail.vue') },
  { path: '/', name: 'main', meta: {title: 'listMain', icon: 'index'},  component: () => import('@/views/listMain.vue') },
  { path: '/count', name: 'count', meta: {title: 'dataCount', icon: 'index'},  component: () => import('@/views/dataCount.vue') },
] 
const noNavRoutes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', meta: {title: '404'}, component: () => import('@/views/404.vue') },
]
const routes = [
  
]

export const showRoutes = [...staticRoutes, ...routes];

const router = createRouter({
	history: createWebHashHistory(),
	// routes: [...showRoutes, ...noNavRoutes],
	routes: [...showRoutes],
});

// 路由加载前
router.beforeEach(async (to, from, next) => {
	// NProgress.configure({ showSpinner: false });
  NProgress.start()
	next()
});

// 路由加载后
router.afterEach(() => {
	NProgress.done()
});

export default router