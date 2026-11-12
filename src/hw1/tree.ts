import { Leaf, varyColor } from './leaf'
import type { RGB } from './leaf'

const MAX_DEPTH = 7 // 遞迴幾層就停（終止條件）
const LEAF_FROM_DEPTH = 4 // 第幾層以後的細枝開始長葉子
const LEAVES_PER_BRANCH = 3 // 每根長葉子的樹枝上有幾片
const SHRINK = 0.7 // 每一層樹枝長度變成上一層的幾倍
const SPREAD = 0.5 // 分岔時左右張開的角度（弧度，約 ±28°）
const JITTER = 0.3 // 每根樹枝角度的隨機擾動（弧度）

// 一棵樹共用的顏色：樹皮一種顏色，葉子以 leafBase 為中心隨機變化
export type TreeColors = { bark: string; leafBase: RGB }

export class Tree {
  x: number
  y: number
  length: number // 這一段樹枝的長度
  angle: number // 樹枝方向：0 = 正上方，正值往右傾（弧度）
  depth: number // 第幾層（樹幹 = 0）
  colors: TreeColors
  endX: number
  endY: number
  branches: Tree[] = []
  leaves: Leaf[] = []

  constructor(x: number, y: number, length: number, angle: number, depth: number, colors: TreeColors) {
    this.x = x
    this.y = y
    this.length = length
    this.angle = angle
    this.depth = depth
    this.colors = colors
    // 長度拆成水平、垂直兩個分量；canvas 的 y 往下為正，所以往上要用減的
    this.endX = x + Math.sin(angle) * length
    this.endY = y - Math.cos(angle) * length

    if (depth >= LEAF_FROM_DEPTH) {
      this.growLeaves()
    }

    if (depth >= MAX_DEPTH) {
      return
    }

    const count = Math.random() < 0.3 ? 3 : 2 // 大多 2 根，30% 機率 3 根
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1) - 0.5 // 2 根：-0.5, 0.5；3 根：-0.5, 0, 0.5
      const childAngle = angle + t * 2 * SPREAD + (Math.random() - 0.5) * JITTER
      this.branches.push(new Tree(this.endX, this.endY, length * SHRINK, childAngle, depth + 1, colors))
    }
  }

  // 沿著這根樹枝隨機放幾片葉子；最後一層另外在末端放一片
  growLeaves() {
    const count = this.depth >= MAX_DEPTH ? LEAVES_PER_BRANCH + 1 : LEAVES_PER_BRANCH
    for (let i = 0; i < count; i++) {
      // t = 0 是起點、1 是終點：起點 + (終點 - 起點) × t（線性內插）
      const t = i === LEAVES_PER_BRANCH ? 1 : 0.3 + Math.random() * 0.7
      const lx = this.x + (this.endX - this.x) * t
      const ly = this.y + (this.endY - this.y) * t
      const side = Math.random() < 0.5 ? -1 : 1 // 往樹枝左邊或右邊斜
      const rotation = this.angle + side * (0.4 + Math.random() * 0.5)
      const radius = 2 + Math.random() * 2
      this.leaves.push(new Leaf(lx, ly, radius, rotation, varyColor(this.colors.leafBase, 25)))
    }
  }

  // 先畫完整棵樹的樹枝，再畫葉子，葉子才不會被後面的樹枝蓋住
  drawBranches(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.colors.bark
    ctx.lineWidth = Math.max(1, this.length / 10)
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.endX, this.endY)
    ctx.stroke()

    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].drawBranches(ctx)
    }
  }

  drawLeaves(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.leaves.length; i++) {
      this.leaves[i].draw(ctx)
    }
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].drawLeaves(ctx)
    }
  }
}
