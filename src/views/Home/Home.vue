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
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three'
import dayjs from 'dayjs'
let scene: Scene
let camera: PerspectiveCamera
let renderer: WebGLRenderer
let timer: number
export default defineComponent({
  name: 'Home',
  setup (props, {attrs, slots, emit}) {
    console.log(attrs, slots, emit)
    onMounted(() => {
    })
  },
  components: {},
  data () {
    return {
      dateTime: dayjs().format('YYYY年M月D日 HH:mm:ss')
    }
  },
  created () {
    timer = setTimeout((function timeUpdate (this: any) {
      this.dateTime = dayjs().format('YYYY年M月D日 HH:mm:ss')
      timer = setTimeout(timeUpdate.bind(this), 1000)
    }).bind(this), 1000)
  },
  mounted () {
    console.log('mounted')
    const canvas: HTMLCanvasElement = this.$refs.canvas as HTMLCanvasElement
    scene = new Scene()
    camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    renderer = new WebGLRenderer({ canvas, antialias: true })
    console.log(renderer.domElement.clientWidth)
    console.log(renderer.domElement.width)
    camera.position.z = 5
    /* 光线 */
    const light = new THREE.DirectionalLight(0xFFFFFF, 1)
    light.position.set(-1, 2, 4)
    scene.add(light)
    /* 立方体 */
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const materail = new THREE.MeshPhongMaterial({ color: 0x44aa88 })
    const cube = new THREE.Mesh(geometry, materail)
    scene.add(cube)
    cube.position.setX(0)
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
    function update (time: number) {
      if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      }
      cube.rotation.x = (0.001 * time)
      cube.rotation.y = (0.001 * time)
      renderer.render(scene, camera)
      requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  },
  beforeUnmount () {
    clearTimeout(timer)
  }
})
</script>

<style lang="scss" src="./home.scss"></style>