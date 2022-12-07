import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'

export const staticRoutes = [
  { path: '/', name: 'main', meta: {title: '统计', icon: 'index'},  component: () => import('@/views/listMain.vue') },
  { path: '/markList', name: 'markList', meta: {title: '记录', icon: 'index'},  component: () => import('@/views/markList.vue') },
  { path: '/listTable', name: 'listTable', meta: {title: '概览', icon: 'index'},  component: () => import('@/views/listTable.vue') },
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