import * as map from './map.js'
import * as rpg from './rpg.js'

const CIVS=rpg.shuffle( ['Britons','Byzantines','Celts','Chinese','Franks','Goths','Japanese','Mongols','Persians','Saracens','Teutons','Turks','Vikings','Aztecs','Huns','Koreans','Mayans','Spanish','Incas','Indians','Italians','Magyars','Slavs','Berbers','Ethiopians','Malians','Portuguese','Burmese','Khmer','Malay','Vietnamese','Bulgarians','Cumans','Lithuanians','Tatars'],false)
const DEBUG=false

export var player=CIVS.pop()

export function debug(){
  for(let h of map.get())
    h.innerHTML=`${h.getAttribute('x')}:${h.getAttribute('y')}`
}

export function setup(){
  if(DEBUG) debug()
  for(let m of map.get()) m.setAttribute('map','land')
  var water=map.get(0)
  water.push(...map.get(6))
  for(let w of water) w.setAttribute('map','water')
  var mixed=map.get(1)
  mixed.push(...map.get(5))
  for(let m of mixed) m.setAttribute('map','mixed')
  map.get(0,0).setAttribute('map','migration')
  map.get(6,0).setAttribute('map','migration')
  map.get(2,0).setAttribute('map','nomad')
  map.get(4,0).setAttribute('map','nomad')
  for(let m of map.get()){
    if(rpg.chancein(3)){
      m.removeAttribute('map')
      continue
    }
    m.setAttribute('civilization',CIVS.pop())
  }
}
