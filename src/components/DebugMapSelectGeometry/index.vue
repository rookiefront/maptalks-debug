<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {type Map, VectorLayer} from "maptalks";

import {
  ElConfigProvider,
} from "element-plus";
import DrawSymbol from "../../components/DrawSymbol/index.vue";
interface Props {
  geometrys: any[]
}

const props = withDefaults(defineProps<Props>(), {});
const symbols = ref(props.geometrys.map(t => {
  let defaultSymbol = {}
  console.log(t.getType())
  switch (t.getType()) {
    case 'Polygon':
      defaultSymbol = {
        lineColor: undefined,
        polygonFill: undefined,
      }
      break
    case 'Point':
      defaultSymbol = {
        textFill: undefined
      }
  }
  return t.getSymbol() || defaultSymbol
}))
</script>
<script lang="ts">
export default {
  name: 'DebugMapSelectGeometry'
}
</script>

<template>
  <div class="DebugMapSelectGeometry">
    <div v-for="(g,index) in props.geometrys">
      <div> {{g.getLayer().getId()}} </div>
      <DrawSymbol :geometry="g" :symbol="symbols[index]"></DrawSymbol>
    </div>
  </div>
</template>

<style  lang="scss">

</style>
