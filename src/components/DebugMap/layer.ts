import * as maptalks from 'maptalks'
import {VectorLayer} from "maptalks";

export default class {
  map: maptalks.Map

  constructor(map: maptalks.Map) {
    this.map = map
    this.map.on('mousemove', (e) => {
      let layers = this.getLayers();
      layers.forEach((t:any) => {
        const layer = t.originLayer
        if (layer.identify){
          let identify = layer.identify(e.coordinate);
        }
      })
    })
  }

  dispose() {
    this.map = null as any
  }

  printLayer(layer: VectorLayer) {
    layer.getId && console.log('layer-id', layer.getId())
    console.log('layer', layer)
    layer.getGeometries && console.log('geometry', layer.getGeometries())
  }

  onActiveGeometrySelect(layer: VectorLayer) {
    layer.getId && console.log('layer-id', layer.getId())
    console.log('layer', layer)
    layer.getGeometries && console.log('geometry', layer.getGeometries())
  }

  getLayers() {
    const l = [this.map.getBaseLayer(), ...this.map.getLayers()].filter(t => t).map((t, index) => {
      const t2 = {
        id: t.getId(),
        zIndex: t.getZIndex(),
        zIndexChange: (value: any) => {
          t.setZIndex(value)
        },
        visible: t.isVisible(),
        visibleChange: (value: any, s: boolean) => {
        },
        originLayer: t
      }
      t2.visibleChange = (visible, s) => {
        l[index].visible = visible
        if (s) {
          visible = !t.isVisible();
          l[index].visible = visible
        }
        if (visible) {
          t.show()
        } else {
          t.hide()
        }
      }
      return t2
    })
    return l
  }
}