<script setup lang="ts">

interface Props {
  type: | string
  color?: any
  size?: string | number
  height?: string | number
  width?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'solid-arrow',
  size: '1rem',
})
</script>
<script lang="ts">
export default {
  name: 'icon',
}
</script>
<template>
  <i
    class="map-iconfont"
    :style="{
      color: props.color,
      width: props.width! || props.size,
      height: props.height!  || props.size
    }"
  >
    <svg
      :fill="'currentColor'"
      aria-hidden="true"
    >
      <use v-bind:xlink:href="'#map-' + props.type"></use>
    </svg>
  </i>
</template>

<style scoped lang="scss">
// 字体
.map-iconfont {
  overflow: hidden;
  display: flex;
}
</style>
