import * as maptalks from 'maptalks'
import {VectorLayer} from "maptalks";
import {Ref, ref} from "vue";


export default class {
  map: maptalks.Map
  layers:Ref<any[]> = ref([])
  _identify = false
  _identifySelect = ref(false)
  _identifyLayers:any[] = []
  _identifySelectGeometry: Ref<maptalks.Geometry[]> = ref([])
  coordinate: any
  constructor(map: maptalks.Map) {
    this.map = map
    this.map.on('click', () => {
      if (this._identifySelect.value){
        this.identifyLayerEnd()
      }
    })
    this.map.on('mousemove', (e) => {
      this.coordinate = e.coordinate
      if (this._identifySelect.value){
        this.identifyLayers(this._identifyLayers, e.coordinate)
      }
    })
  }

  dispose() {
    this.map = null as any
  }
  identifyLayerEnd() {
    this._identifySelect.value = false
    ;(this.map.getLayers() || []).forEach((layer: any) => {
      (layer.getGeometries() || []).forEach((g: maptalks.Geometry) => {
        if (g.options.debugMapSymbol){
          let symbol =  g.options.debugMapSymbol
          if (symbol.null){
            g.setSymbol(null as any)
          }else{
            g.setSymbol(g.options.debugMapSymbol)
          }
        }
      })
    })
  }

  identifyLayer(layer?: any){
    this.identifyLayerEnd()
    let layers = this.map.getLayers()
    if (layer){
      layers = [layer.originLayer]
    }
    this._identifyLayers = layers
    this._identifySelect.value = true
  }
  private identifyLayers(layers: maptalks.Layer[],coordinate:any){
    if (this._identify){
      return
    }
    this._identify = true
    this._identifySelectGeometry.value = []
    const glist:any[] = []
    layers.forEach((layer:any) => {
      if (layer.identify){
        (layer.getGeometries() || []).forEach((g:maptalks.Geometry) => {
          if (g.options.debugMapSymbol){
            let symbol =  g.options.debugMapSymbol
            if (symbol.null){
              g.setSymbol(null as any)
            }else{
              g.setSymbol(g.options.debugMapSymbol)
            }
          }
        })
        let geometrys = layer.identify(coordinate) || [];
        geometrys.forEach((g:maptalks.Geometry) => {
          glist.push(g)
          let symbol = g.getSymbol() || {null: true};
          if (!g.options.debugMapSymbol){
            g.options.debugMapSymbol = symbol
          }
          g.setSymbol(Object.assign({}, symbol, {
            lineColor: 'black',
            polygonFill: 'red',
          }))
        })
      }
    })
    this._identifySelectGeometry.value = glist
    this._identify = false
  }

  printLayer(layer: VectorLayer) {
    layer.getId && console.log('layer-id', layer.getId())
    console.log('layer', layer)
    layer.getGeometries && console.log('geometry', layer.getGeometries())
  }


  getLayers() {
    this.identifyLayerEnd()
    this.layers.value = []
    this._identifySelectGeometry.value = []
    const l = this.layers.value = [this.map.getBaseLayer(), ...this.map.getLayers()].filter(t => t).map((t, index) => {
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
        this.layers.value[index].visible = visible
        if (s) {
          visible = !t.isVisible();
          this.layers.value[index].visible = visible
        }
        if (visible) {
          t.show()
        } else {
          t.hide()
        }
      }
      return t2
    })
    return this.layers
  }
}