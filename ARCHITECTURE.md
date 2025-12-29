# 项目架构

## 1. 概览
本项目是一个基于 **Vue 3** 和 **Three.js** 构建的 3D Web 应用程序。它包含交互式的 3D 场景，包括一个带有动态几何体动画的文字展示页面，以及一个可控制的 3D 角色模型页面。

## 2. 技术栈
- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **开发语言**: TypeScript
- **3D 库**: Three.js
- **路由**: Vue Router
- **样式**: SCSS / CSS
- **辅助工具**: lil-gui (调试 UI), gltf-loader (模型加载)

## 3. 目录结构
```text
src/
├── assets/          # 静态资源 (CSS, 图片)
├── router/          # 路由配置
├── utils/           # 工具函数
├── views/           # 页面组件
│   ├── Composable/  # 组合式 API 逻辑 (Three.js 设置)
│   ├── HomeView.vue # 角色控制场景
│   └── Text.vue     # 文字与几何体动画场景
├── App.vue          # 根组件
└── main.ts          # 应用入口文件
```

## 4. 架构示意图

为确保在所有平台都能正常查看，以下使用文本形式展示架构。

### 组件与路由结构
```text
App.vue
 └── RouterView
      │
      ├── 路由: / (首页)
      │    └── Text.vue
      │         └── Three.js 场景 (文字 + 甜甜圈动画)
      │
      └── 路由: /dog (小狗页面)
           └── HomeView.vue
                │
                └── Composable: useInitThree
                     ├── 初始化 Three.js 环境 (Scene, Camera, Renderer)
                     └── 加载 GLTF 模型 (柴犬)
```

### 数据流与逻辑关系
```text
[HomeView.vue]
  │
  ├── 状态管理
  │    └── sceneContainer (挂载点引用)
  │
  ├── 生命周期 & 交互
  │    ├── onMounted: 挂载渲染器，启动动画循环
  │    ├── animate: 渲染帧循环 (requestAnimationFrame)
  │    └── EventListeners: 监听 Window 键盘事件 (ArrowKeys)
  │
  └── 调用逻辑 (useInitThree)
       │
       ├── [useInitThree.ts]
       │    ├── 初始化: Scene, Camera, Renderer, Light, GridHelper
       │    ├── 资源加载: GLTFLoader -> 加载 'shiba/scene.gltf'
       │    ├── 状态导出: 
       │    │    ├── master (模型实例)
       │    │    └── movement (移动方向状态)
       │    └── 返回上下文对象给 HomeView
```

## 5. 关键模块

### 视图 (Views)
- **Text.vue**: 落地页。渲染 3D 文字以及背景中漂浮的甜甜圈几何体。包含一个 `lil-gui` 面板用于调试参数（如半径、管道粗细等）。
- **HomeView.vue**: "小狗"页面。加载一个 GLTF 模型（柴犬），并实现了键盘控制（方向键）来移动角色。

### 组合式函数 (Composables)
- **useInitThree.ts**: 封装了设置 Three.js 场景的样板代码（场景、相机、渲染器、灯光、辅助器）。目前它还专门处理了柴犬模型的加载。

### 工具 (Utils)
- **index.ts**: 包含辅助函数，例如用于正确解析资源路径的 `getBaseUrl`。
