import * as map from './map.js'
import * as rpg from './rpg.js'

const CIVS= ['Britons','Byzantines','Celts','Chinese','Franks','Goths','Japanese','Mongols','Persians','Saracens','Teutons','Turks','Vikings','Aztecs','Huns','Koreans','Mayans','Spanish','Incas','Indians','Italians','Magyars','Slavs','Berbers','Ethiopians','Malians','Portuguese','Burmese','Khmer','Malay','Vietnamese','Bulgarians','Cumans','Lithuanians','Tatars']
const DEBUG=new URL(document.location).searchParams.has('debug')

export var player=false

export function debug(){
  for(let h of map.get())
    h.innerHTML=`${h.getAttribute('x')}:${h.getAttribute('y')}`
}

export function setup(){
  if(DEBUG) debug()
  let civs=rpg.shuffle(CIVS,false)
  player=civs.pop()
  map.draw()
  let conquered=map.getconquered()
  for(let m of map.get().filter(m=>m.getAttribute('map'))){
    let civ=conquered.indexOf(m)>=0?player:civs.pop()
    m.setAttribute('civilization',civ)
  }
}
