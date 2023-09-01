<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { Layer, type Map } from "maptalks";

interface Props {
  dMap?: any
}
const props = withDefaults(defineProps<Props>(), {

});
watch(() => props.dMap, () => {
  setMap(props.dMap)
})

let map: Map

const layers = ref<Layer[]>([])
const diff = {
  x: 0,
  y: 0,
}
const drag = ref(false)
const mapOk = ref(false)
const refWrap = ref()
let rootNode:any
function setMap(m: Map) {
  map = m
  mapOk.value = true
  rootNode.appendChild(refWrap.value)
  setTimeout(() => {
    getLayers()
  }, 1000)
}

function getLayers(){
  layers.value = [map.getBaseLayer(),...map.getLayers()].filter(t => t)
  console.log(layers)
}

window.addEventListener('mousemove', onDrag)
window.addEventListener('mouseup', () => drag.value = false)


onMounted( () => {
  const scrollWidth = document.querySelector('#app').clientWidth
  rootNode = document.createElement('div')
  refWrap.value.style.top ='0px'
  nextTick(() => {
    document.body.appendChild(rootNode)
  })
})
onUnmounted(() => {
  rootNode && rootNode.remove()
})

function onMouseDown(event: any){
  let left = event.clientX;
  let top = event.clientY;
  const warpLeft = parseInt(refWrap.value.style.left) || 0
  const warpTop = parseInt(refWrap.value.style.top) || 0
  diff.x = left - warpLeft
  diff.y = top  - warpTop
  drag.value = true
}


function switchHide(){
  let show = false
  for (let valueElement of layers.value) {
    if (valueElement.isVisible()){
      show = true
      break
    }
  }
  if (show){
    layers.value.forEach(t => t.hide())
  }else{
    layers.value.forEach(t => t.show())
  }
}

function onDrag(event: any){
  if (!drag.value){
    return
  }
  var st = document.body.scrollTop || document.documentElement.scrollTop;
  let left = event.clientX;
  let top = event.clientY;
  refWrap.value.style.left = left - diff.x  +  'px'
  refWrap.value.style.top = top + st - diff.y + 'px'
}

defineExpose({
  setMap
})

</script>
<script lang="ts">
export default {
  name: 'DebugMap'
}
</script>

<template>
  <div class="DebugMap"  ref="refWrap">
<!--    TODO:: 先写业务 后面搞 -->
    <div  style="height: 300px;width: 500px; border: 1px solid #3b9bf3;display: flex;flex-direction: column" v-if="mapOk">
      <div class="header" style="background: #3b9bf3;height: 35px" @mousedown="onMouseDown">
        <button @click="getLayers"> 重新获取图层 </button>
        <button @click="switchHide"> 切换显示隐藏 </button>
      </div>
      <div style="flex: 1;position:relative;background: white;">
        <div style="position:absolute;top: 0;bottom:0;left: 0;right: 0; overflow: auto">
          <div v-for="(l,index) in layers" >
            <div  class="layer-name">
              <span class="c-label"> 图层名称 </span>
              <span class="c-wrap"> {{l.getId()}} </span>
            </div>

            <div  class="layer-name layer-zIndex">
              <span class="c-label"> 层级 </span>
              <span class="c-wrap"> <input type="text" :value="l.getZIndex()" @input="({value}) => l.setZIndex(value)">  </span>
            </div>

            <div  class="layer-name layer-zIndex">
              <span class="c-label"> 可见 </span>
              <span class="c-wrap"> {{l.isVisible() ? '是' : '否'}} </span>
            </div>

            <div  class="layer-name layer-zIndex">
              <span class="c-label"> 隐藏显示 </span>
              <span class="c-wrap">  <span ></span> <span @click="() => {
                if(l.isVisible()){
                  l.hide()
                }else{
                  l.show()
                }

              }"> 切换 </span> <span @click="() => l.hide()"> 隐藏 </span>  <span @click="() => l.show()"> 显示 </span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
  .DebugMap{
    position: fixed;
    z-index: 9999;
  }
</style>
