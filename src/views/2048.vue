<script setup lang="ts">
import { ref, onMounted } from 'vue'

onMounted(() => {
    //#region 初始化游戏状态

    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!

    // 游戏地图设置（0: 空地, 1: 墙壁, 2: 箱子）
    const map = [
        [1, 1, 1, 1, 1],
        [1, 0, 2, 0, 1],
        [1, 0, 0, 2, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
    ]

    const tileSize = 80 // 每格大小
    let player = { x: 2, y: 2 } // 玩家初始位置

    // 绘制地图
    function drawMap() {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === 1) {
                    ctx.fillStyle = '#666' // 墙壁
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
                } else if (map[y][x] === 2) {
                    ctx.fillStyle = '#f90' // 箱子
                    ctx.fillRect(
                        x * tileSize + 10,
                        y * tileSize + 10,
                        tileSize - 20,
                        tileSize - 20,
                    )
                } else {
                    ctx.fillStyle = '#ddd' // 空地
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
                }
                ctx.strokeStyle = '#333'
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize)
            }
        }

        // 绘制玩家
        ctx.fillStyle = '#09f'
        ctx.beginPath()
        ctx.arc(
            player.x * tileSize + tileSize / 2,
            player.y * tileSize + tileSize / 2,
            tileSize / 4,
            0,
            Math.PI * 2,
        )
        ctx.fill()
    }
    //#endregion 初始化游戏状态

    // #region 角色移动逻辑
    // 检查是否可以移动
    function canMove(x, y) {
        if (map[y] && map[y][x] !== undefined && map[y][x] !== 1) {
            return true
        }
        return false
    }

    // 检查箱子是否可以推
    function canPush(x, y, dx, dy) {
        const nextX = x + dx
        const nextY = y + dy
        return map[nextY][nextX] === 0 // 下一个位置为空
    }

    // 移动逻辑
    function movePlayer(dx, dy) {
        const nextX = player.x + dx
        const nextY = player.y + dy

        if (canMove(nextX, nextY)) {
            if (map[nextY][nextX] === 2) {
                const pushX = nextX + dx
                const pushY = nextY + dy
                if (canPush(nextX, nextY, dx, dy)) {
                    map[nextY][nextX] = 0
                    map[pushY][pushX] = 2 // 推动箱子
                } else if (map[pushY][pushX] === map[nextY][nextX]) {
                    map[pushY][pushX] *= 2 // 合并
                    map[nextY][nextX] = 0 // 当前箱子位置清空
                } else {
                    return // 箱子无法移动
                }
            }
            player.x = nextX
            player.y = nextY
        }
    }
    // #endregion 角色移动逻辑

    //
    document.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowUp':
                movePlayer(0, -1)
                break
            case 'ArrowDown':
                movePlayer(0, 1)
                break
            case 'ArrowLeft':
                movePlayer(-1, 0)
                break
            case 'ArrowRight':
                movePlayer(1, 0)
                break
        }
        update()
    })

    // 更新游戏画面
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawMap()
    }

    // 初始化画面
    update()
})
</script>

<template>
    <div class="comp_2048_wrap">
        <h1>推箱子 2048</h1>
        <canvas id="gameCanvas" width="400" height="400"></canvas>
        <p>使用方向键移动角色并推动箱子合并。</p>
    </div>
</template>

<style lang="scss" scoped>
.comp_2048_wrap {
    padding-top: 40px;
    text-align: center;

    #gameCanvas {
        border: 2px solid #333;
        display: block;
        margin: 20px auto;
    }
}
</style>
