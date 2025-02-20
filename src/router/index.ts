import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/Welcome.vue'),
        },
        {
            path: '/girl',
            name: 'girl',
            component: () => import('@/views/Girl.vue'),
        },
        {
            path: '/2048',
            name: '2048',
            component: () => import('@/views/2048.vue'),
        },
    ],
})

export default router
