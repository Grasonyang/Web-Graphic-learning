import { Tree } from './tree'
import type { TreeColors } from './tree'

// 幾種樹的配色：樹皮 + 葉子基準色（rgb）
const PALETTES: TreeColors[] = [
  { bark: 'rgb(101, 71, 53)', leafBase: { r: 71, g: 122, b: 66 } }, // 一般綠
  { bark: 'rgb(84, 62, 50)', leafBase: { r: 45, g: 105, b: 70 } }, // 深綠
  { bark: 'rgb(115, 85, 60)', leafBase: { r: 120, g: 145, b: 60 } }, // 黃綠
  { bark: 'rgb(90, 70, 65)', leafBase: { r: 60, g: 130, b: 110 } }, // 藍綠
  { bark: 'rgb(110, 75, 50)', leafBase: { r: 170, g: 120, b: 50 } }, // 秋天橘黃
]

// 長出 count 棵樹，平均分布在畫面寬度上；每棵樹的高度、傾斜、配色都隨機
export function createForest(w: number, h: number, count: number): Tree[] {
  const trees: Tree[] = []
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) * w / count
    const length = Math.min(w / count, h / 5) * (0.7 + Math.random() * 0.3)
    const lean = (Math.random() - 0.5) * 0.2 // 樹幹稍微傾斜
    const colors = PALETTES[Math.floor(Math.random() * PALETTES.length)]
    trees.push(new Tree(x, h, length, lean, 0, colors))
  }
  return trees
}

// 把森林畫到離屏 canvas 上（只在尺寸改變時畫一次），之後每幀用 drawImage 貼上
export function renderForest(target: HTMLCanvasElement, trees: Tree[], w: number, h: number) {
  const dpr = window.devicePixelRatio || 1
  target.width = Math.round(w * dpr)
  target.height = Math.round(h * dpr)
  const ctx = target.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  for (let i = 0; i < trees.length; i++) {
    trees[i].drawBranches(ctx)
  }
  for (let i = 0; i < trees.length; i++) {
    trees[i].drawLeaves(ctx)
  }
}
