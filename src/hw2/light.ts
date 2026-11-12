import * as THREE from 'three'

// 繼承 PointLight，建立後可以直接用 scene.add() 加入場景。
export class light extends THREE.PointLight {
  constructor() {
    // PointLight(顏色, 強度, 最遠照射距離, 衰減指數)。
    // distance = 0 表示不設距離上限；decay = 2 表示亮度依距離平方衰減。
    super(0xffffff, 30, 0, 2)
    this.name = 'orbitLight'

    // 光源本身看不見，用一顆不受燈光影響的白色小球標示位置。
    // 小球掛在光源下，所以光源移動時，小球也會一起移動。
    this.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      ),
    )

    this.position.set(-2.5, 3, 2.5)
  }

  // 每幀傳入經過的秒數；orbit 控制繞行動畫或固定照明。
  update(t: number, orbit: boolean) {
    if (orbit) {
      // sin / cos 組成 xz 平面的圓：半徑 3、高度 2.5，繞場景中央的機器人轉。
      this.position.set(Math.cos(t) * 3, 2.5, Math.sin(t) * 3)
    } else {
      this.position.set(-2.5, 3, 2.5) // 固定在左前上方，方便檢查機器人形狀。
    }
  }
}
