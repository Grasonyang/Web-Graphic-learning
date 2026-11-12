# Web Graphics Homework 1 & 2

Vite + React + TypeScript；HW2 使用 [three.js](https://threejs.org/)。

| 作業 | 路徑 | 原始碼 |
| --- | --- | --- |
| HW1 Canvas 粒子煙火 | `#/hw1` | `src/hw1/` |
| HW2 Three.js 機器人 | `#/hw2` | `src/hw2/` |

## 學習資料

- 學習指南：[docs/LEARNING.md](docs/LEARNING.md)（搭配 FigJam 白板 https://www.figma.com/board/8Xci3CmZZOmYBG4unaspig ）
- 練習檔：`labs/`（`npm run dev` 後開 `http://localhost:5173/labs/<檔名>.html`）

## 執行

```bash
npm install
npm run dev       # 開發
npm run build     # 輸出到 dist/
npm run preview   # 預覽 build 結果
```

## 作業要求

**HW1（lec02）**
- 以 canvas 繪製粒子效果（煙火、粒子；形狀可為圓、星形等）
- 粒子路徑受重力或其他力影響
- 以森林作為背景（參考 lec03 Canvas for the Nature I）
- 註明參考來源

**HW2（lec06-1）**
1. 使用 BoxGeometry、ConeGeometry、SphereGeometry、CylinderGeometry、TorusGeometry 等組合成簡單三維機器人
2. 不讀入外部模型檔（如 obj）
3. 建立點光源（PointLight）圍繞機器人旋轉的動畫
- Optional：以移動、旋轉、縮放製作機器人動畫

**繳交**：11/13 demo；demo 前將 HW1 與 HW2 相關檔案壓縮後上傳雲端學院。

## 參考來源

- 課程講義 lec02（Canvas 粒子／煙火範例：Particle、Firework 類別與 animate 迴圈）
- 課程講義 lec06-1（Three.js Geometry、Material、Light）
- three.js 官方文件：https://threejs.org/docs/
