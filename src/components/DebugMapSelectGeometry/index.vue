<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {type Map, VectorLayer} from "maptalks";

import {
  ElConfigProvider,
} from "element-plus";
interface Props {
  geometrys: any[]
}

const props = withDefaults(defineProps<Props>(), {});
console.log(props)
</script>
<script lang="ts">
export default {
  name: 'DebugMapSelectGeometry'
}
</script>

<template>
  <div class="DebugMapSelectGeometry">

  </div>
</template>

<style  lang="scss">

</style>
