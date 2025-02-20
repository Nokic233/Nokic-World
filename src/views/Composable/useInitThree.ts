import { ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { getBaseUrl } from '@/utils/index'

// 初始化 Three.js 场景
export default function useInitThree() {
    // 移动速度和按键状态
    let speed = 0.1
    let movement = {
        left: false,
        right: false,
        up: false,
        down: false,
    }

    // 初始化场景
    const scene = new THREE.Scene()

    // GridHelper 显示场景中的网格
    // const gridHelper = new THREE.GridHelper(10, 10) // 参数为网格大小和分段数
    // scene.add(gridHelper)

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000,
    )

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
    })
    renderer.shadowMap.enabled = true // 启用阴影计算
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // 设置阴影类型
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    // light.castShadow = true // 灯光投射阴影
    light.shadow.mapSize.set(4096, 4096) // 设置阴影贴图分辨率
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 1000
    light.position.set(-5, 5, 5)
    scene.add(light)

    const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100)
    // rectLight.castShadow = true
    rectLight.position.set(-10, 10, 10)
    rectLight.lookAt(0, 0, 0)
    // scene.add(rectLight)

    const master = ref<THREE.Group<THREE.Object3DEventMap>>()
    const loader = new GLTFLoader()
    loader.load(getBaseUrl(`/model/girl/girl_01.glb`), gltf => {
        scene.add((master.value = gltf.scene))

        gltf.scene.traverse(child => {
            if ((child as any).isMesh) {
                child.castShadow = true // 启用投射阴影
                child.receiveShadow = true // 启用接收阴影
            }
        })

        // master.value.rotation.y = Math.PI / 6

        // AxesHelper 显示模型的坐标轴
        // const axesHelper = new THREE.AxesHelper(5) // 参数为轴的长度
        // gltf.scene.add(axesHelper)

        const girlPosition = gltf.scene.position
        camera.position.set(0, 0, 6)
        camera.lookAt(girlPosition)
    })

    return { scene, camera, renderer, light, master, speed, movement }
}
