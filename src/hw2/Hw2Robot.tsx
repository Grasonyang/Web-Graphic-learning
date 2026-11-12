import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Homework 2 — Three.js 機器人
 * 要求（lec06-1）：
 *  1. 用 Box / Cone / Sphere / Cylinder / Torus 等 Geometry 組出機器人
 *  2. 不可載入外部模型檔（obj 等）
 *  3. PointLight 繞著機器人旋轉的動畫
 *  Optional：用移動、旋轉、縮放做機器人動畫
 *
 * 目前是骨架：renderer / scene / camera / 繞行點光源 + 一個佔位方塊。
 */
export default function Hw2Robot() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b0d12)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(4, 3, 6)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1, 0)
    controls.update()

    scene.add(new THREE.AmbientLight(0xffffff, 0.15))

    // 繞行點光源，加一顆小球標示光源位置
    const pointLight = new THREE.PointLight(0xffffff, 30, 0, 2)
    pointLight.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      ),
    )
    scene.add(pointLight)

    // TODO: 換成機器人（Group 階層：Body → Head / Shoulder → Arm → Joint ...）
    const placeholder = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0x6b8cff }),
    )
    placeholder.position.y = 1
    scene.add(placeholder)

    const grid = new THREE.GridHelper(10, 10, 0x334055, 0x1c2230)
    scene.add(grid)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    const clock = new THREE.Clock()
    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime()
      pointLight.position.set(Math.cos(t) * 3, 2.5, Math.sin(t) * 3)
      placeholder.rotation.y = t * 0.5
      renderer.render(scene, camera)
    })

    return () => {
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

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
