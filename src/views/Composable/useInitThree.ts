import { ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
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
    const gridHelper = new THREE.GridHelper(10, 10) // 参数为网格大小和分段数
    scene.add(gridHelper)

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000,
    )

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(10, 10, 10).normalize()
    scene.add(light)

    const master = ref<THREE.Group<THREE.Object3DEventMap>>()
    const loader = new GLTFLoader()
    loader.load(`public/model/shiba/scene.gltf`, gltf => {
        scene.add((master.value = gltf.scene))
        master.value.rotation.y = Math.PI / 6
        // AxesHelper 显示模型的坐标轴
        const axesHelper = new THREE.AxesHelper(5) // 参数为轴的长度
        gltf.scene.add(axesHelper)

        const dogPosition = gltf.scene.position
        camera.position.set(0, 10, 10)
        camera.lookAt(dogPosition)
    })

    return { scene, camera, renderer, master, speed, movement }
}
