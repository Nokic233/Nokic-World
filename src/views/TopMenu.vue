<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const buttonArr = computed(() => {
    const currentRouteName = route.name
    if (!currentRouteName) return []
    const allRoutes = router.getRoutes()
    return allRoutes.filter(v => v.name !== currentRouteName)
})
</script>

<template>
    <div class="comp_top_menu">
        <template v-for="item in buttonArr" :key="item.name">
            <Button @click="router.push({ name: item.name })" size="small">
                go to {{ item.name }} page
            </Button>
        </template>
    </div>
</template>

<style lang="scss">
.comp_top_menu {
    position: fixed;
    top: 4px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 4px;
}
</style>
