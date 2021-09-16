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
  width: 100%;
  height: 100%;
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
  min-width: 1600px;
  min-height: 900px;
  font-family: "PingFang SC", "微软雅黑", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
