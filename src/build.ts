import {createApp, createVNode, h, render} from 'vue'
import './assets/element/index.scss'
import App from './build.vue'
import * as maptalks from 'maptalks'
import DebugMap from "./components/DebugMap/index.vue";


const app = createApp(App)
let htmlDivElement = document.createElement('div');
htmlDivElement.id = `a${new Date().getTime().toString()}`
setTimeout(() => {
  // document.body.appendChild(htmlDivElement)
  app.mount('#'+htmlDivElement.id)
}, 0)


export const setMap = (map: maptalks.Map) => {
  let htmlDivElement = document.createElement('div');
  let vNode = createVNode(DebugMap,{});
  render(vNode, htmlDivElement)
  const _setMap = vNode.component?.exposed?.setMap
  if (_setMap) {
    _setMap(map)
  }
}