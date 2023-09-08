<script setup lang="ts">
import * as maptalks from 'maptalks'
import {h, onMounted, ref, render} from "vue";
const refMap = ref()
import DebugMap from './components/DebugMap/index.vue'
import './assets/iconfont/iconfont.js'


onMounted(() => {
  var map = new maptalks.Map(refMap.value, {
    center: [-0.113049,51.498568],
    zoom: 14,
    baseLayer: new maptalks.TileLayer('base', {
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      subdomains: ["a","b","c","d"],
      attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
    })
  });
  let htmlDivElement = document.createElement('div');
  let vNode = h(DebugMap,);
  render(vNode, htmlDivElement)
  const setMap = vNode.component?.exposed?.setMap
  if (setMap) {
    setMap(map)
  }
  new maptalks.VectorLayer('rect-layer-2', [new maptalks.Rectangle(map.getCenter(),800,800)]).addTo(map)

  new maptalks.VectorLayer('rect-layer', [new maptalks.Rectangle(map.getCenter(),500,500)]).addTo(map)

})
</script>

<template>
  <div ref="refMap" class="map"></div>
</template>

<style  lang="scss">
  .map{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
