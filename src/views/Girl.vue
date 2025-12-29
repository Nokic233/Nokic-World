<template>
    <div ref="sceneContainer" class="scene-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import useInitThree from './Composable/useInitThree'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const sceneContainer = ref<HTMLDivElement | null>(null)

const { scene, camera, renderer, light, master, speed, movement } =
    useInitThree()

onMounted(() => {
    sceneContainer.value!.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // animate()

    renderer.setAnimationLoop(() => {
        if (master.value) {
            if (movement.left) master.value.position.x -= speed
            if (movement.right) master.value.position.x += speed
            if (movement.up) master.value.position.z -= speed
            if (movement.down) master.value.position.z += speed
        }

        controls.update()
        light.shadow.camera.updateProjectionMatrix()
        light.shadow.camera.left = -5
        light.shadow.camera.right = 5
        light.shadow.camera.top = 5
        light.shadow.camera.bottom = -5
        light.shadow.camera.near = 0.5
        light.shadow.camera.far = 50
        renderer.render(scene, camera)
    })

    // 监听按键事件
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
    // 移除事件监听器
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
})

const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
        case 'ArrowLeft':
            movement.left = true
            break
        case 'ArrowRight':
            movement.right = true
            break
        case 'ArrowUp':
            movement.up = true
            break
        case 'ArrowDown':
            movement.down = true
            break
    }
}

const onKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
        case 'ArrowLeft':
            movement.left = false
            break
        case 'ArrowRight':
            movement.right = false
            break
        case 'ArrowUp':
            movement.up = false
            break
        case 'ArrowDown':
            movement.down = false
            break
    }
}
</script>

<style>
.scene-container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    overflow: hidden;
}
</style>
