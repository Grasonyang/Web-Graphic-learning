# Web Graphics 學習指南（lec01 → lec06）

搭配 FigJam 白板一起讀：**https://www.figma.com/board/8Xci3CmZZOmYBG4unaspig**

白板由上到下分成 7 區：`00 總覽` → `L01` → `L02` → `L03` → `L05` → `L06` → `HW 實作路線`。每一區都照「概念圖 → 程式碼（逐行註解）→ 想想看 / 常見錯誤便利貼 → ✍ 實作任務」排列。這份文件寫的是白板放不下的東西：**讀的順序、每個 Lab 怎麼做、自我檢查題（附答案）**。

> docs/ 裡只有 lec01、02、03、05、06 五份講義，**沒有 lec04**。

## 怎麼用

1. 先看白板那一講的區塊，跟著程式碼註解讀一遍。
2. 打開對應的 Lab 檔，把 `TODO` 一個一個填完。每個 TODO 都寫了「✔ 看到」什麼才算對。
3. 做「自我檢查」題，先自己想，再展開答案。
4. 5 講都做完，再照「HW 實作路線」把 HW1 / HW2 寫進 `src/`。

```bash
npm install
```

```bash
npm run dev
```

| Lab | 網址（dev server 開著時） | 對應講義 |
| --- | --- | --- |
| `labs/lec01.html` | http://localhost:5173/labs/lec01.html | L01 Canvas 基礎 |
| `labs/lec02-balls.html` | http://localhost:5173/labs/lec02-balls.html | L02 動畫 + 事件 |
| `labs/lec02-clock.html` | http://localhost:5173/labs/lec02-clock.html | L02 變換 + save/restore |
| `labs/lec03-forest.html` | http://localhost:5173/labs/lec03-forest.html | L03 遞迴樹 |
| `labs/lec05-math.html` | http://localhost:5173/labs/lec05-math.html | L05 線性代數（Console 自動測試） |
| `labs/lec06-cubes.html` | http://localhost:5173/labs/lec06-cubes.html | L06 three.js（一定要用 dev server 開） |

---

## L01 · Canvas 基礎

**一定要懂的 5 件事**

1. 網頁畫圖有 Canvas（點陣，畫完只剩像素）、SVG（向量，每個圖形是 DOM 元素）、WebGL（GPU 3D）、CSS3 transform/animation。HW1 用 Canvas，HW2 用 WebGL（three.js）。
2. Canvas 座標原點在**左上角**，**y 往下**是正的。
3. 每次畫圖都是同一個流程：`getElementById` → `getContext('2d')` → 設樣式（`fillStyle`/`strokeStyle`/`lineWidth`/`font`）→ `beginPath()` → 路徑指令（`moveTo`/`lineTo`/`arc`）→ `fill()` 或 `stroke()`。
4. `arc(x, y, r, start, end, anticlockwise)` 的角度是**弧度**。0 在 3 點鐘方向，因為 y 朝下，π/2 在**下方**。
5. 矩形（`fillRect`/`strokeRect`/`clearRect`）不用 `beginPath`，會直接畫出來。

**Lab：`labs/lec01.html`**：夜空漸層 → 發光月亮 → 20 顆星 → 兩座山 → 地面與標題。

<details><summary>自我檢查（點開看答案）</summary>

- **Q：畫 20 顆星時，如果迴圈裡沒有 `beginPath()`，會怎樣？**
  A：所有的 arc 都在同一條路徑上，每顆星之間會被連線，而且每次 `fill()` 都會把前面所有星星重畫一次（越來越慢）。
- **Q：`arc(100, 100, 50, 0, 180)` 為什麼畫出整圓？**
  A：180 是弧度，約 28.6 圈。半圓要寫 `Math.PI`。
- **Q：漸層 `createLinearGradient(0,0,0,H)` 填在 `fillRect(0, H/2, W, H/2)` 上，看到的是漸層的哪一段？**
  A：只有下半段。漸層座標是畫布座標，不是相對於矩形。
- **Q：`drawImage` 什麼都沒畫出來，最常見原因？**
  A：圖片還沒載入完成。要在 `img.onload` 裡畫。

</details>

---

## L02 · 動畫 · 事件 · 2D 變換 · 煙火

**動畫迴圈**：`render()` = 清畫面 → 每個物件 `draw()` → `move()` → `requestAnimationFrame(render)`。rAF 只會呼叫一次，所以結尾要自己再排下一次。

**Ball 類別**：屬性 `x, y, r, color, dx, dy`；`dx/dy` 的正負代表方向，`+0.001` 是避免速度剛好是 0。碰撞判斷要把半徑算進去（`x + r > width`），講義的 `x > width` 會讓半顆球出界。

**事件**：`element.addEventListener('click', fn)`。滑鼠在畫布內的座標 = `e.clientX - canvas.getBoundingClientRect().left`。鍵盤事件綁在 `window`，因為 canvas 預設拿不到焦點。

**2D 變換的數學**

- 旋轉、縮放、錯切是**線性變換**，可寫成 2×2 矩陣。
- 平移不是線性的（T(0) ≠ 0），所以改用**齊次座標** `(x, y) → (x, y, 1)` 和 3×3 矩陣，平移也能用矩陣乘法表示。
- 組合變換 `T1(T2(T3(P))) = (T1·T2·T3)·P`。矩陣乘法不能交換，**順序很重要**。
- Canvas 的 `translate/rotate/scale` 會把新矩陣乘在目前變換矩陣（CTM）的右邊。程式碼寫在前面的變換，在數學式裡是最外層（最後套用到點上）。

**save / restore**：一個存「繪圖狀態」的堆疊（變換矩陣、fillStyle、lineWidth、globalAlpha、font…），不存路徑、不存已經畫好的像素。進入子物件前 `save()`，畫完 `restore()`，兄弟物件之間就不會互相影響。這就是場景圖（scene graph），L03 遞迴樹和 L06 機器人都用同一個概念。

**時鐘**：先 `rotate(i·π/6)` 再 `translate(0, -0.85r)`，數字才會繞著圓周排。反過來的話，所有數字都會擠在 12 點的位置原地旋轉。

**煙火**：`Firework` 上升 → `lifespan` 歸零 → `explode()` 產生 50 個 `Particle` → 粒子 `v *= friction`、`p += v`、`alpha -= 0.01` → 全部淡出就從陣列移除。用 `rgba(0,0,0,0.1)` 半透明覆蓋取代 `clearRect` → 拖尾。

**重力**：`v(n+1) = v(n) + a·Δt`、`p(n+1) = p(n) + v·Δt`。在 `update()` 加一行 `this.vy += this.gravity`。

**講義程式碼要修正的地方**

| 講義寫法 | 問題 | 改成 |
| --- | --- | --- |
| `if (this.x > width \|\| this.x < 0)` | 球心碰到才反彈 | `this.x + this.r > width \|\| this.x - this.r < 0` |
| `for (i = 0 …) { … fireworks.splice(i, 1) }` | 正著跑時，刪掉一個會跳過下一個 | 倒著跑 `for (let i = len - 1; i >= 0; i--)` |
| `fireworks[i].particles[0].alpha <= 0` | 只看第 0 顆粒子 | `fw.particles.every(p => p.alpha <= 0)` |
| `ctx.globalAlpha = this.alpha` 沒還原 | 之後畫的東西全都變淡 | 畫完設回 1，或用 save/restore 包起來 |

**Lab**：`labs/lec02-balls.html`（200 顆球、大小差異、含半徑反彈、點擊新增、空白鍵暫停）、`labs/lec02-clock.html`（金屬外框、12 個數字、3 根針）。

<details><summary>自我檢查（點開看答案）</summary>

- **Q：為什麼用 `requestAnimationFrame` 而不是 `setInterval(render, 16)`？**
  A：rAF 跟螢幕更新同步、不會掉幀疊幀，分頁在背景時會自動暫停省電。
- **Q：`ctx.translate(100,0); ctx.rotate(π/2); fillRect(0,0,50,10)` 和把前兩行順序對調，結果一樣嗎？**
  A：不一樣。第一種是先把原點搬到 (100,0)，再在那裡轉 90°；第二種是先轉座標軸，再沿著「轉過的 x 軸」（也就是畫面的下方）移動 100。
- **Q：`save()` 之後改了 `fillStyle`，畫完不 `restore()`，下一個物件會怎樣？**
  A：下一個物件會繼承這個顏色和變換，而且堆疊沒有彈出，越疊越深。
- **Q：煙火的 `vy` 為什麼是負數？**
  A：canvas 的 y 朝下，往上飛就是 y 變小。

</details>

---

## L03 · 碎形 · 遞迴樹 · 森林

**遞迴兩要素**：終止條件（base case）＋呼叫自己處理更小的問題（recursive case）。少了終止條件就會無限遞迴，最後出現 `RangeError: Maximum call stack size exceeded`。

**碎形圓**：`drawCircle(x, y, r)` 畫完自己後，若 `r > 2` 就呼叫 `drawCircle(x ± r, y, r/2)`。半徑從 200 → 1.56 共 8 層，第 k 層有 2^k 個圓。

**遞迴樹的關鍵**：座標系跟著樹枝走。

1. `translate(w/2, h)`：原點搬到樹根
2. `branch(len)`：畫 `(0,0) → (0,-len)` → `translate(0,-len)` 搬到頂端 → `len *= 0.66`
3. `len > 2` 才分岔：`save → rotate(+θ) → branch → restore`，然後 `save → rotate(−θ) → branch → restore`

`restore` 讓左枝從「分岔點、還沒旋轉」的狀態開始。少了它，左枝會在右枝轉過的方向上再轉 −θ，結果變回直的。

**變化**：線寬 `len * 0.1`（樹幹粗、樹梢細）、顏色依長度（褐 → 綠）、角度加隨機。**`strokeStyle` 要在畫線之前設定**。

**森林**：寫一個 `Tree` class（`x, groundY, len, theta, color`），用 `draw(ctx)` 包 `save → translate → branch → restore`。用 for 迴圈種很多棵，「遠的」樹根放高一點、樹矮一點、顏色淡一點，然後由遠到近排序再畫。

**HW1 重點**：森林裡有 `Math.random()`，每幀重畫會抖動，遞迴也很耗時。正確做法是**畫到離屏 canvas 一次**，之後每幀 `drawImage`。

**Lab：`labs/lec03-forest.html`**，分 A 碎形圓、B 遞迴樹、C 森林（含離屏 canvas）三段。

<details><summary>自我檢查（點開看答案）</summary>

- **Q：遞迴樹 `len *= 0.66`、起始 120、條件 `len > 2`，最多幾層？**
  A：120·0.66^k > 2 → k < log(60)/log(1/0.66) ≈ 9.8，所以最多畫 10 層，約 2^10 ≈ 1000 段線。
- **Q：把縮短比例改成 0.8 會怎樣？**
  A：層數變多（約 19 層，2^19 ≈ 50 萬段），畫面會卡。比例和終止條件決定效能。
- **Q：Tree 的 `draw` 為什麼一定要 save / restore？**
  A：`branch` 裡有一堆 `translate`，不還原的話，下一棵樹的起點會從上一棵的樹梢開始算。

</details>

---

## L05 · 線性代數

**矩陣**：`A(n×m)` 有 n 列 m 行，`aij` 是第 i 列第 j 行。加減要形狀相同、逐元素運算；乘法 `A(n×m)·B(m×p) = C(n×p)`，`cij = Σk aik·bkj`（列 · 行），**不能交換**；`A·I = A`；反矩陣要方陣且 `det ≠ 0`；`(AB)ᵀ = BᵀAᵀ`。

**向量**：有大小和方向，沒有位置。長度 `√(x²+y²+z²)`、單位向量 `v/‖v‖`、加減就是頭尾相接。

**基底與線性獨立**：任何向量都能寫成基底的線性組合 `v = α1v1 + … + αnvn`。線性獨立的意思是只有全部 α = 0 時，組合才會等於 0。維度 = 線性獨立向量的最大個數。標準基底 (1,0)、(0,1)。

**內積**：`a·b = Σ ai·bi = ‖a‖‖b‖cosθ`，結果是純量。大於 0 表示同向、等於 0 表示垂直、小於 0 表示反向。光照的亮度就是 `max(0, N·L)`。

**外積（3D）**：`a×b = (ya·zb − za·yb, za·xb − xa·zb, xa·yb − ya·xb)`，結果是向量，同時垂直 a 和 b（右手定則）。長度等於兩向量張成的平行四邊形面積，`b×a = −(a×b)`。用來算三角形法向量。

**和其他講的關係**：L02 的變換就是 3×3 矩陣乘向量；L06 的 `matrixWorld = parent.matrixWorld × matrix`。

**Lab：`labs/lec05-math.html`**：自己實作 `add/sub/scale/length/normalize/dot/cross/matMul/transpose/R/S/apply`，打開 Console，16 個測試全部 ✅ 才算過；再做「滑鼠拖曳向量 b，即時顯示 a·b 與夾角」。

<details><summary>自我檢查（點開看答案）</summary>

- **Q：(3,6) 和 (1,2) 能當 2D 的基底嗎？**
  A：不能。(3,6) = 3·(1,2)，兩者線性相依，只能組出一條線。
- **Q：`T(5,0)·R(90°)·(1,0)` 和 `R(90°)·T(5,0)·(1,0)` 各是多少？**
  A：(5,1) 和 (0,6)。
- **Q：煙火粒子要往四面八方「平均」炸開，速度怎麼給？**
  A：`angle = i/n · 2π`，`v = speed · (cos angle, sin angle)`。

</details>

---

## L06 · three.js

**物件關係**：`renderer.render(scene, camera)` 會把 `scene` 裡、相機視錐內的東西畫到 `<canvas>`。`Mesh = Geometry（形狀）+ Material（外觀）`。Camera、Light、Mesh、Group 都是 `Object3D`，都有 `position/rotation/scale`，也都能 `.add()` 子物件。

**Hello Cube 8 步**：renderer → camera（`position.z = 2` 往後退）→ scene → geometry + material → mesh → `scene.add` → `render` → 在 rAF 迴圈裡改 rotation 再 render。

**座標系**：右手座標系，**y 朝上**（和 canvas 2D 相反），z 朝向螢幕外，相機預設看向 −Z。

**PerspectiveCamera(fov, aspect, near, far)**：fov 是垂直視角（度）；aspect 是寬除以高，設錯畫面會變形；near 和 far 之外的東西不會畫出來。改了參數要呼叫 `camera.updateProjectionMatrix()`。

**材質與光**：`MeshBasicMaterial` 不受光；`Lambert`（霧面）、`Phong`（有亮點）、`Standard`（物理材質）會受光。光源有 Ambient（補光）、Directional（太陽）、**Point（燈泡，HW2 用這個）**、Spot、Hemisphere。

**響應式**：canvas 有兩種尺寸，一個是 CSS 的顯示大小，一個是內部像素（`setSize(w, h, false)`）。兩者不同時就更新 renderer 和 camera.aspect。

**講義和現況的差異**

- 講義用的 `cdn.skypack.dev` 已經停止服務。單一 HTML 檔請改用 import map（白板 L06 有範例）；在本專案裡直接 `import * as THREE from 'three'`。
- three r155 之後燈光改用物理單位。PointLight 預設 `decay = 2`，強度要給大一點（骨架用的是 30），不然會很暗。

**HW2 的場景圖**：Body → Head / Shoulder → Arm → **JointArm（關節）** → ForeArm → Hand，腳也用同樣結構。關節是一個空的 `Group`，放在關節位置；手臂的 Mesh 往下偏移半個長度，旋轉關節時手臂才會繞著關節轉。

**Lab：`labs/lec06-cubes.html`**：三個方塊 → 換成各種幾何 → wireframe → OrbitControls → 響應式 → 加分做 PointLight 繞行（HW2 暖身）。

<details><summary>自我檢查（點開看答案）</summary>

- **Q：畫面全黑，可能原因？**
  A：沒有光（又用了受光材質）、相機在物體裡面、物體在 near~far 範圍外、忘了呼叫 render。
- **Q：手臂直接 `mesh.rotation.x = 1` 為什麼像螺旋槳？**
  A：Mesh 是繞自己的中心轉。要包一層關節 Group，把旋轉中心搬到肩膀。
- **Q：PointLight 怎麼繞機器人轉？**
  A：`position.set(R·cos t, 高度, R·sin t)`，在 XZ 平面上做圓周運動。

</details>

---

## HW1 / HW2 實作路線

白板「HW 實作路線」區有完整的 8 + 8 步與程式碼片段，這裡只放每一步的提示。

### HW1（`src/hw1/`）

1. 讀懂 `Hw1Fireworks.tsx` 骨架：`useRef`、`ResizeObserver` + `devicePixelRatio`、`animate`、清理函式。
2. `particles.ts`：`Particle`，`draw(ctx)` 透過參數拿 ctx，不要用全域變數。
3. `Firework`：用角度式爆炸（`cos/sin`），炸出來比較圓。
4. `animate` 裡倒著跑迴圈 + `splice`；`canvas` 的 click 事件用 `getBoundingClientRect` 換算座標。
5. `forest.ts`：`Tree` + 遞迴；畫到離屏 canvas，只在 resize 時重畫。
6. 兩層合成：煙火畫在透明的 fx canvas，用 `globalCompositeOperation = 'destination-out'` 淡出，背景才不會被越蓋越黑。
7. 加分：星形粒子、多種爆炸型態、hsl 色彩。
8. README 註明參考來源。

<details><summary>卡住時的提示</summary>

- 畫面越來越慢：檢查陣列有沒有真的 `splice`，或在畫面上印出 `fireworks.length`。
- 森林在閃：代表每幀都在重新產生亂數樹，改成離屏 canvas。
- 森林被拖尾蓋黑：代表在同一張 canvas 上用了 `rgba(0,0,0,0.1)` 覆蓋，改成兩層。
- 切到 #/hw2 再回來，煙火變兩倍快：清理函式沒有 `cancelAnimationFrame`（React StrictMode 開發時會掛載兩次）。

</details>

### HW2（`src/hw2/`）

1. 讀懂 `Hw2Robot.tsx` 骨架（OrbitControls、繞行 PointLight、dispose）。
2. 準備共用材質（受光）。
3. `robot.ts`：`createRobot()` 回傳 `{ robot, parts }`，先做 body 和 head。
4. 細節：眼睛 Sphere、天線 Cylinder + Cone、耳朵 Torus，五種 Geometry 都要用到。
5. `makeArm(side)`：關節 Group 結構。
6. `makeLeg(side)`：同樣的結構，調整 `robot.position.y` 讓腳踩在地上。
7. 動畫：用 `sin(t)` 擺手擺腳、頭轉動、身體彈跳；調整光的半徑、高度、強度。
8. 加分：第二盞彩色光、天線縮放脈動、keydown 切換動作。

<details><summary>卡住時的提示</summary>

- 部件位置對不上：每個 `position` 都是「相對於父物件中心」的位置。先只放 body 和一隻手，用 `AxesHelper` 看座標軸。
- 光繞過去看不出變化：材質還是 `MeshBasicMaterial`，或 PointLight 強度太小。
- 想確認關節位置：在關節 Group 裡加一顆小紅球 Mesh，就看得到旋轉中心在哪。

</details>

### 繳交前

- [ ] `npm run build` 沒有錯誤
- [ ] README 寫好參考來源（lec02 煙火範例、lec03 遞迴樹、lec06 three.js、MDN、three.js docs）
- [ ] HW1 + HW2 壓縮上傳雲端學院（不要包 `node_modules`）
- [ ] 11/13 demo
