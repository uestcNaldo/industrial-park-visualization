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
    console.log('mounted')
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
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      /* 场景 */
      scene = new Scene()
      scene.background = new THREE.Color(0x131D26)

      /* 相机 */
      mainCamera = new PerspectiveCamera(
        50, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        10000
      )
      mainCamera.position.set(100, 50, 150)

      /* 控制器 */
      controls = new OrbitControls(mainCamera, canvas)
      controls.update()

      /* 光线 */
      const light = new THREE.DirectionalLight(0xFFFFFF, 1)
      light.position.set(100, 500, 100)
      light.castShadow = true
      light.shadow.camera.near = 0.1
      light.shadow.camera.far = 20000
      light.shadow.camera.left = -1000
      light.shadow.camera.right = 1000
      light.shadow.camera.bottom = -1000
      light.shadow.camera.top = 1000
      light.shadow.camera.updateProjectionMatrix()
      scene.add(light)
      const lightHelper = new THREE.DirectionalLightHelper(light, 20)
      scene.add(lightHelper)

      /* 轴线辅助 */
      const axesHelper = new THREE.AxesHelper(100)
      // scene.add(axesHelper)
      /* 加载外部模型 */
      glTFLoader.load(
        'c_园区大屏.gltf',
        function onLoad (gltf) {
          console.log(gltf)
          const model: Group = gltf.scene
          // model.scale.setScalar(0.05)
          model.castShadow = true
          model.receiveShadow = true
          ;(function traverse (item: Object3D) {
            item.castShadow = true
            item.receiveShadow = true
            item.children.forEach(o => {
              traverse(o)
            })
          })(model)
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
        const material = new THREE.MeshPhysicalMaterial({
          color: 0x1B232A,
          side: THREE.DoubleSide
        })
        const plane = new THREE.Mesh(geometry, material)
        plane.rotateX(-Math.PI / 2)
        plane.position.setY(-0.5)
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
          renderer.setSize(outerWidth, outerHeight, false)
        }
        return needResize
      }
      /* 更新函数 */
      function update (nowTime: number): void {
        const deltaTime = clock.getDelta()
        if (resizeRendererToDisplaySize(renderer)) {
          mainCamera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight
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