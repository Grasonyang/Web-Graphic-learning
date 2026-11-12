import { useEffect, useRef } from 'react'

/**
 * Homework 1 — Canvas 2D 粒子效果（煙火）
 * 要求（lec02）：
 *  - 用 canvas 繪製粒子效果（圓、星形…皆可）
 *  - 粒子軌跡受重力或其他力影響（v += a·t, p += v·t）
 *  - 森林背景（參考 lec03 Canvas for the Nature I）
 *  - 註明參考來源（見 README）
 *
 * 目前是骨架：resize + requestAnimationFrame 迴圈 + 卸載清理。
 */
export default function Hw1Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const loop = { id: 0 }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // 之後都用 CSS 像素座標繪圖
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const animate = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      // 半透明覆蓋 → 殘影拖尾（講義的 rgba(0,0,0,0.1) 手法）
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, w, h)

      // TODO: 森林背景、Firework / Particle 更新與繪製
      ctx.fillStyle = '#9aa3b5'
      ctx.font = '16px system-ui'
      ctx.fillText('HW1 canvas ready', 16, 28)

      loop.id = requestAnimationFrame(animate)
    }
    loop.id = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(loop.id)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} />
}
