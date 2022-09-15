import * as map from './map.js'
import * as rpg from './rpg.js'

const LAND= ['Britons','Byzantines','Celts','Chinese','Franks','Goths','Japanese','Mongols','Persians','Teutons','Turks','Aztecs','Huns','Mayans','Spanish','Incas','Indians','Magyars','Slavs','Ethiopians','Malians','Burmese','Khmer','Vietnamese','Bulgarians','Cumans','Lithuanians','Tatars']
const CIVS={
  'land':LAND,
  'mixed':LAND,
  'water':['Berbers','Italians','Koreans','Malay','Portuguese','Saracens','Vikings',],
}
const DEBUG=new URL(document.location).searchParams.has('debug')

export var player=rpg.shuffle(CIVS[rpg.pick(Object.keys(CIVS))]).pop()

export function debug(){
  for(let h of map.get())
    h.innerHTML=`${h.getAttribute('x')}:${h.getAttribute('y')}`
}

export function setup(){
  if(DEBUG) debug()
  map.draw()
  let conquered=map.getconquered()
  let civs=new Map()
  for(let c of Object.keys(CIVS)) civs.set(c,rpg.pick(CIVS[c]))
  for(let m of map.get().filter(m=>m.getAttribute('map'))){
    let civ=conquered.indexOf(m)>=0?player:civs.get(m.getAttribute('map'))
    m.setAttribute('civilization',civ)
  }
}
