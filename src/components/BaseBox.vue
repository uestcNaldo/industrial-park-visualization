<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BaseBox'
})
</script>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
interface Props {
  title?: string,
  height?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  height: '16rem'
})
console.log(props)
</script>

<template>
  <div class="base-box" :style="{height: height}">
    <header class="header">
      <div class="header-left">
        <slot name="headerLeft">
          <img src="/src/assets/image/title_frame.png">
          <span class="title">{{title}}</span>
        </slot>
      </div>
      <div class="header-right">
        <slot name="headerRight"></slot>
      </div>
    </header>
    <main class="content">
      <slot name="content"></slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
$--padding-width: 1rem;
.base-box {
  width: 28rem;
  height: 16rem;
  display: flex;
  flex-direction: column;
  background: #1d2a3e88;
  /* 使用linear-gradient实现切角，使用硬性的颜色分割 */
  background: linear-gradient(225deg, transparent 1rem, #1d2a3e88 0);
  .header {
    padding: $--padding-width;
    display: flow-root;
    @include clearfix;
    &-left {
      float: left;
      display: flex;
      align-items: center;
    }
    &-right {
      float: right;
    }
  }
  .title {
    font-size: 1.125rem;
  }
  .content {
    flex: 1;
    padding: 0 $--padding-width $--padding-width;
  }
}
</style>
