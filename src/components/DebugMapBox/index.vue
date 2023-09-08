<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {type Map, VectorLayer} from "maptalks";

import {
  ElConfigProvider,
} from "element-plus";
interface Props {
  dMap?: any,
  css: any
}

const props = withDefaults(defineProps<Props>(), {});

const diff = {
  x: 0,
  y: 0,
}
const drag = ref(false)
const refWrap = ref()
let rootNode: any
window.addEventListener('mousemove', onDrag)
window.addEventListener('mouseup', () => drag.value = false)


onMounted(() => {
  rootNode = document.querySelector('#maptalks-debug-box')
  if (!rootNode){
    rootNode = document.createElement('div')
    rootNode.id = 'maptalks-debug-box'
    nextTick(() => {
      document.body.appendChild(rootNode)
    })
  }else {
    rootNode.innerHTML = ''
  }
  // 等待浏览器加载 盒子之后再设置位置
  setTimeout(() => {
    refWrap.value.style.top = '0'
    refWrap.value.style.left = (window.innerWidth - parseInt(props.css.width)) + 'px'
  //
    rootNode.appendChild(refWrap.value)
  }, 0)

})
onUnmounted(() => {
  rootNode && rootNode.remove()
})

function onMouseDown(event: any) {
  let left = event.clientX;
  let top = event.clientY;
  const warpLeft = parseInt(refWrap.value.style.left) || 0
  const warpTop = parseInt(refWrap.value.style.top) || 0
  diff.x = left - warpLeft
  diff.y = top - warpTop
  drag.value = true
}

function onDrag(event: any) {
  if (!drag.value) {
    return
  }
  var st = document.body.scrollTop || document.documentElement.scrollTop;
  let left = event.clientX;
  let top = event.clientY;
  refWrap.value.style.left = left - diff.x + 'px'
  refWrap.value.style.top = top + st - diff.y + 'px'
}
</script>
<script lang="ts">
export default {
  name: 'DebugMap'
}
</script>

<template>
  <div class="DebugMapBox" ref="refWrap" :style="props.css">
    <div class="DebugMapBox-header" style="background: #3b9bf3;height: 35px;padding-left:15px;display: flex;align-items: center" @mousedown="onMouseDown">
      <slot name="title"></slot>
    </div>
    <div style="flex: 1;position:relative;background: white;">
      <div style="position:absolute;top: 0;bottom:0;left: 0;right: 0; overflow: auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style  lang="scss">
.DebugMapBox {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  .map-debug-collapse-item__header{
  }
  .map-debug-collapse-item__header{
    pointer-events: none;
  }
  .map-debug-collapse-item__arrow{
    pointer-events: all;
  }
  .DebugMapBox-header{
    user-select: none;
  }

}

</style>
