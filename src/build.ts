import {createApp, createVNode, h, render} from 'vue'
import './assets/element/index.scss'
import './assets/iconfont/iconfont.js'
import App from './build.vue'
import * as maptalks from 'maptalks'
import DebugMap from "./components/DebugMap/index.vue";

const app = createApp(App)
let htmlDivElement = document.createElement('div');
htmlDivElement.id = `a${new Date().getTime().toString()}`
setTimeout(() => {
  app.mount('#'+htmlDivElement.id)
}, 0)
let ______vNode:any;

export const setMap = (map: maptalks.Map,boxZIndex?:number) => {
  let htmlDivElement = document.createElement('div');
  let vNode = createVNode(DebugMap,{});
  render(vNode, htmlDivElement)
  const _setMap = vNode.component?.exposed?.setMap
  ______vNode =  vNode.component?.exposed
  if (_setMap) {
    _setMap(map)
  }
  const _setZIndex = vNode.component?.exposed?.setZIndex
  if (boxZIndex){
    _setZIndex(boxZIndex)
  }
}


export const close =() =>{
  ______vNode.close()
}
