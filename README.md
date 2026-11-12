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

### HW1

講義頁數以 `docs/` 內 PDF 的頁碼為準。

| 程式 | 來源 |
| --- | --- |
| `Particle` 類別結構（位置、顏色、alpha、`draw` / `update`） | lec02 p.33–34；**學生自行撰寫** |
| 重力 `vy += gravity`、`x += vx` | lec02 p.39（Add gravity force：v(n+1) = v(n) + a·t） |
| 隨機角度 + `cos` / `sin` 分解初速 | 自行修改（講義為 `(Math.random() - 0.5) * 8`），Claude Code 建議 |
| 一次爆炸產生多顆粒子 | lec02 p.35–36（Firework 類別） |
| 隨機 rgb 顏色、`rgba(0,0,0,0.1)` 殘影、`requestAnimationFrame` 迴圈、`splice` 移除 | lec02 p.37–38 |
| 點擊事件 `addEventListener('click')` | lec02 p.8 |
| 從後往前刪除、alpha 先檢查再畫（修正最後閃一下） | Claude Code 協助修正 |
| React 外殼（`useRef`、`useEffect`、`ResizeObserver`、`devicePixelRatio`） | 講義未涵蓋，Claude Code 協助撰寫 |
| 煙火範例原始出處 | lec02 p.30 標註「Source: Coding Fireworks」 |

### 其他

- 課程講義 lec02（Canvas 粒子／煙火範例：Particle、Firework 類別與 animate 迴圈）
- 課程講義 lec06-1（Three.js Geometry、Material、Light）
- three.js 官方文件：https://threejs.org/docs/
