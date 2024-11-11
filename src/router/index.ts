import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/Text.vue'),
        },
        {
            path: '/dog',
            name: 'dog',
            component: () => import('@/views/HomeView.vue'),
        },
    ],
})

export default router
