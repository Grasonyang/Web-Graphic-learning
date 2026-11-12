import { useEffect, useEffectEvent, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { robot as Robot } from './robot'
import { light as Light } from './light'

/**
 * Homework 2 — Three.js 機器人
 * 要求（lec06-1）：
 *  1. 用 Box / Cone / Sphere / Cylinder / Torus 等 Geometry 組出機器人
 *  2. 不可載入外部模型檔（obj 等）
 *  3. PointLight 繞著機器人旋轉的動畫
 *  Optional：用移動、旋轉、縮放做機器人動畫
 *
 * 機器人由 robot.ts 建立，點光源與繞行位置由 light.ts 管理。
 */
export default function Hw2Robot() {
  const containerRef = useRef<HTMLDivElement>(null)
  // 預設開啟繞行，符合題目要求；可用勾選框切換成固定照明。
  const [orbitLight, setOrbitLight] = useState(true)

  // 動畫能讀到最新的 state，切換開關時不必重新建立場景與相機。
  const updateLight = useEffectEvent(function updateLight(pointLight: Light, t: number) {
    pointLight.update(t, orbitLight)
  })

  useEffect(function setup() {
    const container = containerRef.current!

    // 建立繪圖器、場景、相機與滑鼠控制。
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b0d12)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(4, 3, 6)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1.9, 0) // 看向機器人身體中央
    controls.update()

    // 加入基本照明、點光源、機器人與地面格線。
    scene.add(new THREE.AmbientLight(0xffffff, 0.15))

    // 點光源與標示小球統一在 light.ts 建立。
    const pointLight = new Light()
    scene.add(pointLight)

    const robot = new Robot()
    scene.add(robot)

    const grid = new THREE.GridHelper(10, 10, 0x334055, 0x1c2230)
    scene.add(grid)

    const clock = new THREE.Clock()

    // 容器尺寸改變時，同步調整畫布大小與相機比例。
    function onResize() {
      const { clientWidth: w, clientHeight: h } = container
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    // 每幀更新光源的位置，再由相機的視角畫出場景。
    function animate() {
      const t = clock.getElapsedTime()
      updateLight(pointLight, t)
      robot.update(t)
      renderer.render(scene, camera)
    }

    // act
    onResize()
    const observer = new ResizeObserver(onResize)
    observer.observe(container)
    renderer.setAnimationLoop(animate)

    // 元件卸載時，停止動畫並釋放事件監聽與繪圖資源。
    return function cleanup() {
      renderer.setAnimationLoop(null)
      observer.disconnect()
      controls.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          ;(obj.material as THREE.Material).dispose()
        }
      })
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <label
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          borderRadius: 6,
          background: '#12151ce6',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={orbitLight}
          onChange={(event) => setOrbitLight(event.target.checked)}
        />
        光源繞行
      </label>
    </div>
  )
}
