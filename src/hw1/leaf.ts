export type RGB = { r: number; g: number; b: number }

export class Leaf {
  x: number
  y: number
  radius: number // 葉子寬度的一半；長度是寬度的 2 倍
  rotation: number // 葉子朝向（弧度），跟著樹枝方向
  color: string

  constructor(x: number, y: number, radius: number, rotation: number, color: string) {
    this.x = x
    this.y = y
    this.radius = radius
    this.rotation = rotation
    this.color = color
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    // ellipse 第 5 個參數是旋轉角度
    ctx.ellipse(this.x, this.y, this.radius, this.radius * 2, this.rotation, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 在 base 顏色附近 ±range 隨機挑一個顏色
export function varyColor(base: RGB, range: number): string {
  const r = clamp(base.r + (Math.random() - 0.5) * 2 * range)
  const g = clamp(base.g + (Math.random() - 0.5) * 2 * range)
  const b = clamp(base.b + (Math.random() - 0.5) * 2 * range)
  return `rgb(${r}, ${g}, ${b})`
}

function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}
