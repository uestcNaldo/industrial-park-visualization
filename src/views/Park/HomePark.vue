<template>
  <div class="box-wrapper left">
    <BaseBox title="园区实时能耗总览"></BaseBox>
    <BaseBox title="今日用能曲线"></BaseBox>
    <BaseBox title="厂房用能排行"></BaseBox>
  </div>
  <div class="box-wrapper right">
    <BaseBox title="园区环境监测"></BaseBox>
    <BaseBox title="站点用电对比"></BaseBox>
    <BaseBox title="实时告警类型占比"></BaseBox>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import BaseBox from 'components/BaseBox.vue'
</script>

<style lang="scss" src="./park.scss"></style>