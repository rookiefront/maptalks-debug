<script setup lang="ts">
import DebugMapBox from "../../components/DebugMapBox/index.vue";
import {reactive, ref} from "vue";
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
import {VectorLayer} from "maptalks";
let map;
const mapIsOk = ref(false)
const mapBoxCss = ref({
  height: '500px',
  width: '500px',
  border: '1px solid #d4d4d4',
  backgroundColor: 'white',
})
function setMap(m:any){
  map = m
  mapIsOk.value = true
}
function elementLayerChange(event:any){
  // e.defaultPrevented()
  event.stopPropagation();
}


defineExpose({
  setMap,
  close: () => {
    map = undefined
    mapIsOk.value = false
  }
})


const mvvmData = reactive({
  openLayerId: '',
})
const layers = ref([])
// 图层上的逻辑

function getLayers() {
  const l = [map.getBaseLayer(), ...map.getLayers()].filter(t => t).map((t, index) => {
    const t2 = {
      id: t.getId(),
      zIndex: t.getZIndex(),
      zIndexChange: (value:any) => {
        t.setZIndex(value)
      },
      visible: t.isVisible(),
      visibleChange: (value: any, s: boolean) => {
      },
      originLayer: t
    }
    t2.visibleChange = (visible, s) => {
      layers.value[index].visible = visible
      if (s) {
        visible = !t.isVisible();
        layers.value[index].visible = visible
      }
      if (visible) {
        t.show()
      } else {
        t.hide()
      }
    }
    return t2
  })
  layers.value = l
  console.log('layers',layers.value)
}

function switchHide() {
  let show = false
  for (let valueElement of layers.value) {
    if (valueElement.originLayer.isVisible()) {
      show = true
      break
    }
  }
  if (show) {

    layers.value.forEach((t:any) => {
      t.visible = false
      t.originLayer.hide()
    })
  } else {

    layers.value.forEach((t:any) => {
      t.visible = true
      t.originLayer.show()
    })
  }
}
function printLayer(layer: VectorLayer){
  //
  layer.getId && console.log('layer-id',layer.getId())
  console.log('layer',layer)
  layer.getGeometries && console.log('geometry', layer.getGeometries())
}

function onActiveGeometry(l:any){
  console.log(l)
}


</script>
<script lang="ts">
export default {
  name: 'DebugMap'
}
</script>

<template>
  <el-config-provider namespace="map-debug">
    <DebugMapBox v-if="mapIsOk" :css="mapBoxCss" class="DebugMap">
      <template #title>
        <div class="header-icon">
          <Icon type="xuanze"></Icon>
        </div>
        <el-button size="small" @click="getLayers"> 重新获取图层</el-button>
        <el-button size="small" @click="switchHide"> 切换显示隐藏</el-button>
      </template>
      <template #default>
        <el-collapse accordion v-model="mvvmData.openLayerId">
          <el-collapse-item :name="l.id" v-for="(l,index) in layers">
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
                  <Icon  type="dayin" @click="printLayer(l.originLayer)"></Icon>
                </div>
                <div class="header-icon">
                  <Icon type="xuanze" @click="onActiveGeometry(l)"></Icon>
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
