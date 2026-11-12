export class Particle {
  x: number
  y: number
  vx: number // 每幀水平位移量
  vy: number // 每幀垂直位移量
  color: string
  alpha = 1 // 1 = 不透明，隨時間減到 0 後移除
  radius = 5 // 粒子從大慢慢變小
  gravity = 0.04 // 重力加速度（固定值）
  friction = 0.97 // 空氣阻力：每幀速度乘上這個值，爆開後會減速、停在空中再落下

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    this.color = color
    const angle = Math.random() * Math.PI * 2 // 0~360° 隨機方向
    const speed = Math.random() * 6 + 2 // 隨機速度 2~8
    this.vx = Math.cos(angle) * speed // 拆成水平分量
    this.vy = Math.sin(angle) * speed // 拆成垂直分量
  }

  update() {
    this.vx *= this.friction // 阻力讓速度變小
    this.vy *= this.friction
    this.vy += this.gravity // 重力讓速度往下加（v += a）
    this.x += this.vx // 速度讓位置改變（p += v）
    this.y += this.vy
    this.alpha -= 0.012 // 慢慢變透明
    this.radius *= 0.985
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}
