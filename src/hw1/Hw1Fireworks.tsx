import { useEffect, useRef } from 'react'
import { Particle } from './particle'
import { Firework } from './firework'
import { createForest, renderForest } from './forest'

/**
 * Homework 1 — Canvas 2D 粒子效果（煙火）
 * 要求（lec02）：
 *  - 用 canvas 繪製粒子效果（圓、星形…皆可）
 *  - 粒子軌跡受重力或其他力影響（v += a·t, p += v·t）
 *  - 森林背景（參考 lec03 Canvas for the Nature I）
 *  - 註明參考來源（見 README）
 */

// 讓 canvas 的實際像素數 = 顯示大小 × 螢幕倍率，避免高解析螢幕上模糊
function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = window.devicePixelRatio || 1
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // 之後都用 CSS 像素座標繪圖
}

const LAUNCH_CHANCE = 0.03 // 每一幀自動發射一顆煙火的機率
const PARTICLES_PER_EXPLOSION = 100

// 隨機亮色：先隨機 rgb，再等比例放大到最大的通道 = 255，避免抽到暗色
function randomBrightColor(): string {
  const r = Math.random() * 256
  const g = Math.random() * 256
  const b = Math.random() * 256
  const scale = 255 / Math.max(r, g, b, 1)
  return `rgb(${Math.round(r * scale)}, ${Math.round(g * scale)}, ${Math.round(b * scale)})`
}

// 從地面 (x, groundY) 發射一顆煙火，飛到 targetY 爆炸
function launch(fireworks: Firework[], x: number, groundY: number, targetY: number) {
  fireworks.push(new Firework(x, groundY, targetY, randomBrightColor()))
}

// 在 (x, y) 炸出 count 顆同色粒子
function explode(particles: Particle[], x: number, y: number, count: number, color: string) {
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color))
  }
}

// 每顆煙火彈往上飛一幀；到最高點就換成一團粒子
function updateFireworks(ctx: CanvasRenderingContext2D, fireworks: Firework[], particles: Particle[]) {
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const f = fireworks[i]
    f.update()
    if (f.exploded) {
      explode(particles, f.x, f.y, PARTICLES_PER_EXPLOSION, f.color)
      fireworks.splice(i, 1)
      continue
    }
    f.draw(ctx)
  }
}

// 每顆粒子更新一幀並畫出來，透明的刪掉
// 從後往前跑：splice 刪掉元素時，前面還沒處理的 index 不會被打亂
function updateParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.update()
    // 先檢查再畫：alpha 變負數時 globalAlpha 會忽略這個值（維持 1），粒子會全亮閃一下
    if (p.alpha <= 0) {
      particles.splice(i, 1)
      continue
    }
    p.draw(ctx)
  }
}

export default function Hw1Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(function setup() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const particles: Particle[] = []
    const fireworks: Firework[] = []
    const forest = document.createElement('canvas') // 離屏 canvas，不放進畫面
    let frameId = 0

    function onResize() {
      resizeCanvas(canvas, ctx)
      // 尺寸改變時才重新長樹並畫一次，避免每一幀重畫上萬片葉子
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderForest(forest, createForest(w, h, 8), w, h)
    }

    // 點擊：從點擊位置正下方的地面發射，飛到點擊的高度爆炸
    function onClick(e: MouseEvent) {
      launch(fireworks, e.offsetX, canvas.clientHeight, e.offsetY)
    }

    function animate() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // 半透明覆蓋 → 殘影拖尾
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, w, h)

      // 森林每幀貼回來，才不會被殘影的黑色蓋掉
      ctx.drawImage(forest, 0, 0, w, h)

      // 自動發射：隨機位置，在畫面上方 15%~45% 的高度爆炸
      if (Math.random() < LAUNCH_CHANCE) {
        launch(fireworks, Math.random() * w, h, h * (0.15 + Math.random() * 0.3))
      }

      // 'lighter' = 顏色相加：粒子重疊的地方會更亮，看起來像在發光
      ctx.globalCompositeOperation = 'lighter'
      updateFireworks(ctx, fireworks, particles)
      updateParticles(ctx, particles)
      ctx.globalCompositeOperation = 'source-over' // 還原成一般的覆蓋模式

      frameId = requestAnimationFrame(animate)
    }

    onResize()
    const observer = new ResizeObserver(onResize)
    observer.observe(canvas)
    canvas.addEventListener('click', onClick)
    frameId = requestAnimationFrame(animate)

    return function cleanup() {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={canvasRef} />
}
