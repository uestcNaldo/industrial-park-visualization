<template>
  <div class="home">
    <canvas id="drawCanvas" ref="canvas"></canvas>
    <header class="home-header">
      <div class="header-date">{{dateTime}}</div>
      <h1 class="header-title">河边镇工业园区精细化管理大屏</h1>
    </header>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed, watch, onMounted } from 'vue'
import * as THREE from 'three'
import { Scene, PerspectiveCamera, WebGLRenderer, Group, Object3D, CameraHelper } from 'three'
import dayjs from 'dayjs'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let renderer: WebGLRenderer
let scene: Scene
let mainCamera: PerspectiveCamera
let controls: OrbitControls
const clock = new THREE.Clock()
const glTFLoader = new GLTFLoader().setPath('/src/assets/model/park/')

let timer: number
const dateFormat = 'YYYY年M月D日 HH:mm:ss'

export default defineComponent({
  name: 'Home',
  components: {},
  setup (props, {attrs, slots, emit}) {
    return {
    }
  },
  data () {
    return {
      dateTime: dayjs().format(dateFormat)
    }
  },
  created () {
    timer = setTimeout((function timeUpdate (this: any) {
      this.dateTime = dayjs().format(dateFormat)
      timer = setTimeout(timeUpdate.bind(this), 1000)
    }).bind(this), 1000)
  },
  mounted () {
    this.initRenderer()
    this.animate()
  },
  beforeUnmount () {
    clearTimeout(timer)
  },
  methods: {
    initRenderer () {
      const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement
      renderer = new WebGLRenderer({ canvas, antialias: true, logarithmicDepthBuffer: true })
      /* renderer阴影开启 */
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      /* renderer输出编码 */
      renderer.outputEncoding = THREE.sRGBEncoding

      /* 场景 */
      scene = new Scene()
      scene.background = new THREE.Color(0x131D26)

      /* 主相机 */
      const fov = 50
      const aspect = window.innerWidth / window.innerHeight
      const near = 0.1
      const far = 10000
      mainCamera = new PerspectiveCamera(fov, aspect, near, far)
      mainCamera.position.set(100, 50, 150)

      /* 控制器 */
      controls = new OrbitControls(mainCamera, canvas)
      controls.enableDamping = true
      controls.update()

      /* 平行光线 */
      {
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(100, 200, 100)
        light.castShadow = true
        const maxTextureSize = renderer.capabilities.maxTextureSize
        light.shadow.mapSize = new THREE.Vector2(maxTextureSize, maxTextureSize)
        const shadowCamera = light.shadow.camera
        shadowCamera.near = 0.1
        shadowCamera.far = 20000
        shadowCamera.left = -1000
        shadowCamera.right = 1000
        shadowCamera.bottom = -1000
        shadowCamera.top = 1000
        shadowCamera.updateProjectionMatrix()
        scene.add(light)
        scene.add(light.target)
        const lightHelper = new THREE.DirectionalLightHelper(light, 20)
        scene.add(lightHelper)
      }
      /* 环境光 */
      {
        const light = new THREE.AmbientLight(0xffffff, 1)
        scene.add(light)
      }
      /* 半球光 */
      {
        const skyColor = 0x131D26
        const groundColor = 0x1B232A
        const light = new THREE.HemisphereLight(skyColor, groundColor, 1)
        scene.add(light)
      }

      /* 加载外部模型 */
      glTFLoader.load(
        'c_园区大屏.gltf',
        function onLoad (gltf) {
          console.log(gltf)
          const model: Group = gltf.scene
          model.traverse((obj) => {
            obj.castShadow = true
            obj.receiveShadow = true
          })
          scene.add(model)
        },
        undefined,
        function onError (err) {
          console.error(err)
        }
      )
      /* 地面 */
      {
        const geometry = new THREE.PlaneGeometry(10000, 10000)
        const material = new THREE.MeshStandardMaterial({
          color: 0x1B232A,
          side: THREE.DoubleSide
        })
        const plane = new THREE.Mesh(geometry, material)
        plane.rotateX(-Math.PI / 2)
        plane.position.setY(-0.1)
        plane.receiveShadow = true
        plane.name = '地面'
        scene.add(plane)
      }
    },
    animate () {
      /* 是否需要更新canvas */
      function resizeRendererToDisplaySize (renderer: WebGLRenderer): Boolean {
        const canvas = renderer.domElement
        const outerWidth = canvas.clientWidth * window.devicePixelRatio
        const outerHeight = canvas.clientHeight * window.devicePixelRatio
        const renderWidth = canvas.width
        const renderHeight = canvas.height
        const needResize = outerWidth !== renderWidth || outerHeight !== renderHeight
        if (needResize) {
          /* 设置renderer的渲染分辨率 */
          renderer.setSize(outerWidth, outerHeight, false)
        }
        return needResize
      }
      /* 更新函数 */
      function update (nowTime: number): void {
        const deltaTime = clock.getDelta()
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement
          mainCamera.aspect = canvas.clientWidth / canvas.clientHeight
          mainCamera.updateProjectionMatrix()
        }
        controls.update()
        renderer.render(scene, mainCamera)
        requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
      console.log(renderer)
    }
  }
})
</script>

<style lang="scss" src="./home.scss"></style>