<template>
  <router-view></router-view>
</template>

<script lang="ts">
export default {
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss">
html, body {
  width: 100vw;
  height: 100vh;
}

:root {
  font-size: 16px;
  color: $--font-color;
}

* {
  margin: 0;
  line-height: 1;
  box-sizing: border-box;
}

#app {
  width: 100%;
  height: 100%;
  font-family: "PingFang SC", "微软雅黑", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
