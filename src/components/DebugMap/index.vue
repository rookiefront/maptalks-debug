<script setup lang="ts">
import DebugMapBox from "../../components/DebugMapBox/index.vue";
import DebugMapSelectGeometry from "../../components/DebugMapSelectGeometry/index.vue";
import {reactive, Ref, ref, watch, onUnmounted} from "vue";
import Icon from "../../components/Icon/index.vue";
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
import  LayerUtil from "./layer";

let layerUtilHandle:LayerUtil;
const mapIsOk = ref(false)
const mapBoxCss = ref({
  height: '500px',
  width: '500px',
  border: '1px solid #d4d4d4',
  backgroundColor: 'white',
})
function setMap(m:any){
  mapIsOk.value = true
  layerUtilHandle = new LayerUtil(m)
  setTimeout(() => {
    getLayers()
  },0)
}
function elementLayerChange(event:any){
  // e.defaultPrevented()
  event.stopPropagation();
}


function close(){
  layerUtilHandle && layerUtilHandle.dispose()
  mapIsOk.value = false
}

defineExpose({
  setMap,
  close
})


const mvvmData = reactive({
  openLayerId: '',
})
const layers:Ref<any[]> = ref([])
// 图层上的逻辑
/**
 * 获取所有的图层
 */
function getLayers() {
  layerUtilHandle.getLayers()
  console.log('layers',layerUtilHandle.layers.value)
}
watch(() => layers.value, () => {
  console.log('layers',layers.value)
},{deep: true, immediate: true})

function switchHide() {
  let show = false
  const layers = layerUtilHandle.layers.value
  for (let valueElement of layers) {
    if (valueElement.originLayer.isVisible()) {
      show = true
      break
    }
  }
  if (show) {
    layers.forEach((t:any) => {
      t.visible = false
      t.originLayer.hide()
    })
  } else {
    layers.forEach((t:any) => {
      t.visible = true
      t.originLayer.show()
    })
  }
}
onUnmounted(() => {
  close()
})
</script>
<script lang="ts">
export default {
  name: 'DebugMap'
}
</script>

<template>
  <el-config-provider namespace="map-debug">
    <DebugMapBox v-if="mapIsOk && layerUtilHandle" :css="mapBoxCss" class="DebugMap">
      <template #title>
        <div class="header-icon" @click="() => layerUtilHandle.identifyLayer(undefined)">
          <Icon type="xuanze"></Icon>
          <div> {{layerUtilHandle._identifySelectGeometry.value.length}} </div>
        </div>
        <el-button size="small" @click="getLayers"> 重新获取图层</el-button>
        <el-button size="small" @click="switchHide"> 切换显示隐藏</el-button>
        <el-button size="small" @click="() => layerUtilHandle.printMap()"> 打印当前地图信息</el-button>
      </template>
      <template #default>
        <DebugMapSelectGeometry
            v-if="!layerUtilHandle._identifySelect.value && layerUtilHandle._identifySelectGeometry.value.length > 0"
            :geometrys="layerUtilHandle._identifySelectGeometry.value"
        ></DebugMapSelectGeometry>
        <template v-else>
          <el-collapse accordion v-model="mvvmData.openLayerId" v-if="layerUtilHandle.layers.value.length > 0">
            <el-collapse-item :name="l.id" v-for="(l,index) in layerUtilHandle.layers.value || []">
              <template #title>
                <div class="layer-input" @click="elementLayerChange">
                  <div class="row-title"> {{ l.id }}</div>
                  <div>
                    <el-input-number
                        v-model="l.zIndex"
                        controls-position="right"
                        @change="l.zIndexChange"
                        style="width: 100px"
                    />
                  </div>
                  <div class="row-icon">
                    <Icon  type="dayin" @click="() => layerUtilHandle.printLayer(l.originLayer)"></Icon>
                  </div>
                  <div class="header-icon">
                    <Icon type="xuanze" @click="() =>  layerUtilHandle.identifyLayer(l)"></Icon>
                  </div>
                  <el-radio-group
                      v-model="l.visible"
                      @change="l.visibleChange"
                      style="margin:0 35px"
                  >
                    <el-radio :label="true"> 是</el-radio>
                    <el-radio :label="false"> 否</el-radio>
                  </el-radio-group>
                </div>
              </template>

              <div>
                <el-form label-width="60px">
                  <el-form-item label="ID">
                    <el-input v-model="l.id" disabled></el-input>
                  </el-form-item>

                  <el-form-item label="层级">
                    <el-input-number
                        v-model="l.zIndex"
                        controls-position="right"
                        @change="l.zIndexChange"
                    />
                  </el-form-item>

                  <el-form-item label="可见">
                    <div style="display: flex;">
                      <el-radio-group
                          v-model="l.visible"
                          @change="l.visibleChange"
                          style="margin-right: 35px"
                      >
                        <el-radio :label="true"> 是</el-radio>
                        <el-radio :label="false"> 否</el-radio>
                      </el-radio-group>
                      <el-button @click.stop="l.visibleChange(null, true)">
                        切换
                      </el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-collapse-item>
          </el-collapse>
        </template>
      </template>
    </DebugMapBox>
  </el-config-provider>
</template>

<style  lang="scss">
.DebugMapBox{
  .header-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .row-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    box-sizing: border-box;
  }
  .layer-input {
    display: flex;
    pointer-events: all;
    color: black;
    .map-debug-radio-group{
      margin-left: 5px!important;
      .map-debug-radio{
        margin-right: 5px!important;
      }
    }
    .row-title{
      width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0px 5px;
    }
  }
}
</style>
