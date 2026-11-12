import * as THREE from 'three'

// 整台機器人是一個 Group；移動或旋轉它時，所有子部件都會跟著變換。
export class robot extends THREE.Group {
  constructor() {
    // 先初始化父類別 Group，才能使用 this。
    super()
    // name 方便之後用 getObjectByName('body') 等方式找到部件。
    this.name = 'robot'

    // MeshPhongMaterial 是會受燈光影響、能產生反光的材質。
    // color 設定表面顏色；0x 開頭代表十六進位 RGB 色碼。
    // shininess 控制反光的集中程度（預設 30），specular 控制反光顏色。
    // 同一種材質可供多個部件共用。
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6b8cff })
    const jointMaterial = new THREE.MeshPhongMaterial({ color: 0xaab4c4 })
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x111827 })
    const accentMaterial = new THREE.MeshPhongMaterial({ color: 0xffc857 })

    // position 都是相對於父物件的區域座標。
    // set(x, y, z)：此模型以 +x 向右、+y 向上、+z 為正面。
    // Mesh 將 Geometry（形狀與尺寸）和 Material（表面外觀）組合起來。
    // 身體：BoxGeometry(寬, 高, 深)，掛在整台機器人的 Group 下。
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.7), bodyMaterial)
    body.name = 'body'
    body.position.set(0, 1.85, 0)
    this.add(body) // add() 建立父子關係，body 會跟著 robot 移動與旋轉。

    // 脖子：CylinderGeometry(上半徑, 下半徑, 高)，圓柱預設沿 y 軸延伸。
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2), jointMaterial)
    neck.name = 'neck'
    neck.position.set(0, 0.8, 0)
    body.add(neck)

    // 頭部直接掛在 body 下；此處 y = 1.25 是相對身體中心的位置。
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.7), bodyMaterial)
    head.name = 'head'
    head.position.set(0, 1.25, 0)
    body.add(head)

    // 天線桿掛在 head 下，頭部旋轉時天線也會一起轉。
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35), jointMaterial)
    antenna.name = 'antenna'
    antenna.position.set(0, 0.52, 0)
    head.add(antenna)

    // 天線頂端：ConeGeometry(底面半徑, 高)。
    const antennaTip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2), accentMaterial)
    antennaTip.name = 'antennaTip'
    antennaTip.position.set(0, 0.8, 0)
    head.add(antennaTip)

    // 用正負號建立兩側；關節使用空 Group，方便之後旋轉四肢。
    for (const side of [-1, 1]) {
      // side 乘上 x 座標，產生鏡像位置；名稱以模型的 x 負側為 left、正側為 right。
      const prefix = side === -1 ? 'left' : 'right'

      // 眼睛：SphereGeometry(半徑)，放在頭部正面的 z = 0.35 處。
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1), eyeMaterial)
      eye.name = `${prefix}Eye`
      eye.position.set(side * 0.2, 0.05, 0.35)
      head.add(eye)

      // 耳朵：TorusGeometry(圓環半徑, 管子半徑)。
      const ear = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04), accentMaterial)
      ear.name = `${prefix}Ear`
      ear.rotation.y = Math.PI / 2 // 角度使用弧度；繞 y 軸轉 90°，讓圓環朝向側面。
      ear.position.set(side * 0.47, 0, 0)
      head.add(ear)

      // 肩膀本身沒有外觀，是手臂的旋轉支點；旋轉它會帶動整隻手臂。
      const shoulder = new THREE.Group()
      shoulder.name = `${prefix}Shoulder`
      shoulder.position.set(side * 0.75, 0.55, 0)
      body.add(shoulder)

      // 肩膀關節球：半徑比上臂稍大，預設位置 (0, 0, 0) 就是肩膀中心。
      const shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.16), jointMaterial)
      shoulderBall.name = `${prefix}ShoulderBall`
      shoulder.add(shoulderBall)

      // 上臂以中心建模，往下移半個高度，讓上端對齊肩膀原點。
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.7), jointMaterial)
      upperArm.name = `${prefix}UpperArm`
      upperArm.position.set(0, -0.35, 0)
      shoulder.add(upperArm)

      // 手肘放在上臂末端，掛在肩膀下；旋轉時會帶動關節球、前臂與手。
      const elbow = new THREE.Group()
      elbow.name = `${prefix}Elbow`
      elbow.position.set(0, -0.7, 0)
      shoulder.add(elbow)

      // 手肘關節球：半徑比上臂、前臂都稍大，放在手肘的區域座標原點。
      const elbowBall = new THREE.Mesh(new THREE.SphereGeometry(0.14), accentMaterial)
      elbowBall.name = `${prefix}ElbowBall`
      elbow.add(elbowBall)

      // 前臂中心位於手肘下方 0.3，讓上端對齊手肘原點。
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), bodyMaterial)
      forearm.name = `${prefix}Forearm`
      forearm.position.set(0, -0.3, 0)
      elbow.add(forearm)

      // 手的位置也相對於手肘，所以會隨前臂一起繞手肘轉動。
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.15), accentMaterial)
      hand.name = `${prefix}Hand`
      hand.position.set(0, -0.65, 0)
      elbow.add(hand)

      // 髖關節位於身體底部，是腿與腳掌共同的旋轉支點。
      const hip = new THREE.Group()
      hip.name = `${prefix}Hip`
      hip.position.set(side * 0.3, -0.7, 0)
      body.add(hip)

      // 髖關節球：半徑比腿（0.18）稍大，放在髖關節原點，會隨腿一起旋轉。
      const hipBall = new THREE.Mesh(new THREE.SphereGeometry(0.22), accentMaterial)
      hipBall.name = `${prefix}HipBall`
      hip.add(hipBall)

      // 大腿、小腿各長 0.5，合計維持原本的腿長 1.0。
      // 大腿中心下移半個高度，讓上端對齊髖關節。
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5), jointMaterial)
      thigh.name = `${prefix}Thigh`
      thigh.position.set(0, -0.25, 0)
      hip.add(thigh)

      // 膝關節放在大腿末端；旋轉 knee.rotation.x 可讓小腿與腳掌一起彎曲。
      const knee = new THREE.Group()
      knee.name = `${prefix}Knee`
      knee.position.set(0, -0.5, 0)
      hip.add(knee)

      // 膝關節球位於膝蓋原點，半徑比腿稍大，讓關節清楚可見。
      const kneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.2), accentMaterial)
      kneeBall.name = `${prefix}KneeBall`
      knee.add(kneeBall)

      // 小腿的位置相對於膝關節，中心下移 0.25，讓上端對齊膝蓋。
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5), jointMaterial)
      shin.name = `${prefix}Shin`
      shin.position.set(0, -0.25, 0)
      knee.add(shin)

      // 腳掌改掛在膝關節下；區域座標 y = -0.57，維持伸直時原本的位置。
      // z = 0.05 讓腳掌稍微往正面突出。
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.5), bodyMaterial)
      foot.name = `${prefix}Foot`
      foot.position.set(0, -0.57, 0.05)
      knee.add(foot)
    }
  }

  // 每幀呼叫一次：用移動、旋轉、縮放做出「繞圈散步」動畫。
  // 只改關節與整台機器人的屬性，子部件會依階層自動跟著動。
  update(t: number) {
    const get = (name: string) => this.getObjectByName(name)!
    const s = t * 4 // 走路節奏：數字越大，手腳擺得越快

    // 移動：沿半徑 1.5 的圓圈走（和光源繞行同樣用 cos / sin）
    const angle = t * 0.5
    this.position.x = Math.cos(angle) * 1.5
    this.position.z = Math.sin(angle) * 1.5
    this.position.y = Math.abs(Math.sin(s)) * 0.06 // 每踏一步彈一下

    // 旋轉：在角度 angle 處，前進方向是 (-sin, cos)；機器人預設面向 +z，轉 -angle 剛好面向前方
    this.rotation.y = -angle

    // 旋轉：手腳擺動。左右相反，同一側的手和腳也相反
    for (const [prefix, dir] of [['left', 1], ['right', -1]] as const) {
      const swing = Math.sin(s) * dir
      get(`${prefix}Hip`).rotation.x = swing * 0.5 // 正值往後、負值往前
      get(`${prefix}Knee`).rotation.x = Math.max(0, -swing) * 0.8 // 腿往前時膝蓋往後彎
      get(`${prefix}Shoulder`).rotation.x = -swing * 0.5
      get(`${prefix}Elbow`).rotation.x = -0.3 // 手肘微彎（前臂往前）
    }

    // 旋轉：頭左右張望
    get('head').rotation.y = Math.sin(t * 0.8) * 0.4

    // 縮放：每 3 秒眨一次眼（y 方向壓扁 0.12 秒）
    const blink = t % 3 < 0.12 ? 0.1 : 1
    get('leftEye').scale.y = blink
    get('rightEye').scale.y = blink

    // 縮放：天線頂端一脹一縮
    get('antennaTip').scale.setScalar(1 + Math.sin(t * 5) * 0.3)
  }
}
