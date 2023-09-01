<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import { Layer, type Map } from "maptalks";
import {
  ElRadio,
  ElRadioGroup,
  ElButton,
  ElConfigProvider,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElCollapse,
  ElCollapseItem,
} from "element-plus";


interface Props {
  dMap?: any
}
const props = withDefaults(defineProps<Props>(), {

});
watch(() => props.dMap, () => {
  setMap(props.dMap)
})

let map: Map

const layers = ref<any>([])
const diff = {
  x: 0,
  y: 0,
}
const drag = ref(false)
const mapOk = ref(false)
const refWrap = ref()
const mvvmData = reactive({
  openLayerId: '',
})
let rootNode:any
function setMap(m: Map) {
  setTimeout(() => {
    map = m
    mapOk.value = true
    rootNode.appendChild(refWrap.value)
    setTimeout(() => {
      getLayers()
    }, 1000)
  },100)
}

function getLayers(){
  const l = [map.getBaseLayer(),...map.getLayers()].filter(t => t).map(t => {
    return {
      id: t.getId(),
      zIndex: t.getZIndex(),
      visible: t.isVisible(),
      originLayer: t
    }
  })
  layers.value = l
}

window.addEventListener('mousemove', onDrag)
window.addEventListener('mouseup', () => drag.value = false)


onMounted( () => {
  const scrollWidth = document.querySelector('#app').clientWidth
  rootNode = document.createElement('div')
  rootNode.className='maptalks-debug-box'
  // 等待浏览器加载 盒子之后再设置位置
  setTimeout(() => {
    refWrap.value.style.top ='0'
    refWrap.value.style.left = (window.innerWidth - refWrap.value.clientWidth) + 'px'
  },500)
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
  <el-config-provider namespace="map-debug">
    <div class="DebugMap"  ref="refWrap">
      <!--    TODO:: 先写业务 后面搞 -->
      <div  style="height: 300px;width: 500px; border: 1px solid #3b9bf3;display: flex;flex-direction: column" v-if="mapOk">
        <div class="header" style="background: #3b9bf3;height: 35px" @mousedown="onMouseDown">
<!--          <button @click="getLayers"> 重新获取图层 </button>-->
<!--          <button @click="switchHide"> 切换显示隐藏 </button>-->
        </div>
        <div style="flex: 1;position:relative;background: white;">
          <div style="position:absolute;top: 0;bottom:0;left: 0;right: 0; overflow: auto">
            <el-collapse v-model="mvvmData.openLayerId">
              <el-collapse-item :name="l.id"  v-for="(l,index) in layers" >
                <template #title>
                  {{l.id}}
                </template>
                <div>
                  <el-form label-width="60px">
                    <el-form-item label="ID">
                      <el-input v-model="l.id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="层级">
                      <el-input-number v-model="l.zIndex" controls-position="right" @change="(value) => l.originLayer.setZIndex(value)"></el-input-number>
                    </el-form-item>

                    <el-form-item label="可见">
                      <div style="display: flex;">
                        <el-radio-group v-model="l.visible" @change="val => val ? l.originLayer.show() : l.originLayer.hide() " style="margin-right: 35px">
                          <el-radio :label="true"> 是 </el-radio>
                          <el-radio :label="false"> 否 </el-radio>
                        </el-radio-group>
                        <el-button @click="() => {
                      const value =  l.originLayer.isVisible()
                      l.visible = !value
                      l.visible ? l.originLayer.show() : l.originLayer.hide()
                    }">
                          切换
                        </el-button>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>

      </div>
    </div>

  </el-config-provider>
</template>

<style  lang="scss">
  .DebugMap{
    position: fixed;
    z-index: 9999;
  }
</style>
