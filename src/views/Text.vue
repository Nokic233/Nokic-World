<script setup lang="ts">
import { ref, unref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import * as THREE from 'three'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { getBaseUrl } from '@/utils/index'
import Stats from 'three/addons/libs/stats.module.js'

const route = useRoute()
// const isDebug = computed(() => route.hash === '#debugger')
const isDebug = computed(() => true)
const container = ref<HTMLDivElement>()
const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
    init()
})

function random() {
    return (Math.random() - 0.5) * 20
}

function init() {
    // const stats = new Stats()
    // unref(container)?.appendChild(stats.dom)

    const sizes = {
        width: unref(canvas)!.clientWidth,
        height: unref(canvas)!.clientHeight,
    }

    const clock = new THREE.Clock()

    const textureLoader = new THREE.TextureLoader()
    const matcapTextureArr = [
        textureLoader.load(getBaseUrl(`/textures/matcaps1.png`)),
        textureLoader.load(getBaseUrl(`/textures/matcaps2.png`)),
        textureLoader.load(getBaseUrl(`/textures/matcaps3.png`)),
    ]
    const matcapMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTextureArr[0],
    })

    const renderer = new THREE.WebGLRenderer({
        canvas: unref(canvas),
        antialias: true,
        powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(sizes.width, sizes.height)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        1,
        100,
    )

    const controls = new OrbitControls(camera, renderer.domElement)
    camera.position.set(0, 1, 4)

    const fontLoader = new FontLoader()
    fontLoader.load(
        getBaseUrl(`/fonts/helvetiker_regular.typeface.json`),
        font => {
            const textGeometry = new TextGeometry('Welcome to Nokic World !', {
                font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3,
            })
            // textGeometry.computeBoundingBox()
            textGeometry.center()
            const textMesh = new THREE.Mesh(textGeometry, matcapMaterial)
            scene.add(textMesh)
        },
    )

    // 批量甜甜圈
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.1)
    console.time('donut')
    const donutArr = new Array(1000).fill(1).map(() => {
        const donutMesh = new THREE.Mesh(donutGeometry, matcapMaterial)
        donutMesh.position.set(random(), random(), random())
        const t = Math.random()
        donutMesh.scale.set(t, t, t)
        scene.add(donutMesh)
        return donutMesh
    })
    console.timeEnd('donut')

    renderer.setAnimationLoop(() => {
        const elapsedTime = clock.getElapsedTime()
        donutArr.forEach((v, i) => {
            v.rotation.x = elapsedTime + i
            v.rotation.y = elapsedTime + i
            v.rotation.z = elapsedTime + i
        })
        controls.enableDamping = true
        controls.update()
        // stats.update()
        renderer.render(scene, camera)
    })

    if (isDebug.value) {
        const gui = new GUI()

        const configObject = {
            radius: donutGeometry.parameters.radius,
            tube: donutGeometry.parameters.tube,
            matcaps: 'matcapTexture1',
        }

        const DonutGeometryFolder = gui.addFolder('donutGeometry')
        DonutGeometryFolder.add(configObject, 'radius', 0.1, 1)
            .name('radius')
            .onChange((value: number) => {
                const newGeometry = new THREE.TorusGeometry(
                    value,
                    donutGeometry.parameters.tube,
                )
                donutArr.forEach(v => {
                    v.geometry.dispose()
                    v.geometry = newGeometry
                })
            })
        DonutGeometryFolder.add(configObject, 'tube', 0.01, 0.2)
            .name('tube')
            .onChange((value: number) => {
                const newGeometry = new THREE.TorusGeometry(
                    donutGeometry.parameters.radius,
                    value,
                )
                donutArr.forEach(v => {
                    v.geometry.dispose()
                    v.geometry = newGeometry
                })
            })

        const materialFolder = gui.addFolder('material')
        materialFolder
            .add(configObject, 'matcaps', [
                'matcapTexture1',
                'matcapTexture2',
                'matcapTexture3',
            ])
            .onChange((value: string) => {
                matcapMaterial.matcap?.dispose()
                const num = +value[value.length - 1] - 1
                matcapMaterial.setValues({ matcap: matcapTextureArr[num] })
            })
    }
}
</script>

<template>
    <div ref="container">
        <canvas
            ref="canvas"
            :style="{
                width: '100vw',
                height: '100vh',
            }"
        ></canvas>
    </div>
</template>

<style lang="scss"></style>
