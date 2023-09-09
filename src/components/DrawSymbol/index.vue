<script setup lang="ts">
import { computed, watch } from "vue";
import {
  ElRadio,
  ElRadioGroup,
  ElButton,
  ElConfigProvider,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElColorPicker,
  ElCollapse,
  ElCollapseItem,
} from "element-plus";
interface Props {
  symbol?: any,
  geometry?: any
}
const props = withDefaults(defineProps<Props>(), {
})

const symbolList = computed(() => {
  if (!props.symbol){
    return []
  }

  if (typeof props.symbol == 'object' && Array.isArray(props.symbol)) {
    return  props.symbol
  }
  return  [props.symbol]
}) as any[]

function keyIsOk(key,s){
  return Object.keys(s).includes(key)
}
watch(() => props.symbol, () => {
  if (!props.geometry){
    return
  }
  props.geometry.options.debugMapSymbol = props.symbol
  props.geometry.setSymbol(props.symbol)
},{deep: true})

</script>

<template>
  <div  class="Draw-Symbol">
    <el-form label-width="85px">
      <template v-for="(symbol,index) in symbolList">
        <div :class="'DrawSymbol-'+index">

          <el-form-item label="线宽度" v-if="keyIsOk('lineWidth', symbol)">
            <el-input-number controls-position="right" v-model="symbol.lineWidth"></el-input-number>
          </el-form-item>

          <el-form-item label="线颜色" v-if="keyIsOk('lineColor', symbol)">
            <div style="display: flex">
              <el-input v-model="symbol.lineColor"></el-input>
              <el-color-picker v-model="symbol.lineColor" color-format="hex"></el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="线透明度" v-if="keyIsOk('lineOpacity', symbol)">
            <el-input-number controls-position="right" v-model="symbol.lineOpacity" :step="0.1" :min="0" :max="1"></el-input-number>
          </el-form-item>


          <el-form-item label="填充色" v-if="keyIsOk('polygonFill', symbol)">
            <div style="display: flex">
              <el-input v-model="symbol.polygonFill"></el-input>
              <el-color-picker v-model="symbol.polygonFill" color-format="hex"></el-color-picker>
            </div>
          </el-form-item>

          <el-form-item label="填充透明度" v-if="keyIsOk('polygonOpacity', symbol)">
            <el-input-number controls-position="right" v-model="symbol.polygonOpacity" :step="0.1" :min="0" :max="1"></el-input-number>
          </el-form-item>


          <el-form-item label="文字大小" v-if="keyIsOk('textSize', symbol)">
            <el-input-number controls-position="right" v-model="symbol.textSize"  :min="0" :max="30"></el-input-number>
          </el-form-item>

          <el-form-item label="文字颜色" v-if="keyIsOk('textFill', symbol)">
            <div style="display: flex">
              <el-input v-model="symbol.textFill"></el-input>
              <el-color-picker v-model="symbol.textFill" color-format="hex"></el-color-picker>
            </div>
          </el-form-item>
        </div>
      </template>
    </el-form>

  </div>
</template>

<style scoped lang="scss">
.Draw-Symbol{
  border: 1px solid rgba(39, 150, 224, 0.5);
  border-radius: 3px;
  //position: absolute;
  //top: 10px;
  //left: 0;
  //right: 0;
  //bottom: 0;
  padding: 10px;
}
</style>