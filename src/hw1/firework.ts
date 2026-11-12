// 從地面往上飛的煙火彈，受重力減速，飛到最高點（速度變 0）時爆炸
export class Firework {
  x: number
  y: number
  vy: number
  color: string
  gravity = 0.05
  exploded = false

  // targetY：希望在哪個高度爆炸
  constructor(x: number, y: number, targetY: number, color: string) {
    this.x = x
    this.y = y
    this.color = color
    // 往上拋要到達高度 H，初速 v = √(2gH)（等加速度運動，v² = 2gH）；往上是負的
    const height = Math.max(0, y - targetY)
    this.vy = -Math.sqrt(2 * this.gravity * height)
  }

  update() {
    this.vy += this.gravity // 重力讓往上的速度越來越小
    this.y += this.vy
    if (this.vy >= 0) {
      this.exploded = true // 到最高點
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }
}
