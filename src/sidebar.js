import * as campaign from './campaign.js'
import * as map from './map.js'
import * as permalink from './permalink.js'

const DIFFICULTY=['easiest','easiest','standard','moderate','hard','hardest','extreme','extreme']
const SIDEBAR=document.querySelector('#sidebar')
const PLAYERS=Array.from(SIDEBAR.querySelectorAll('div')).slice(0,8)
const GOLD=SIDEBAR.querySelector('input')

function set(div,text){div.querySelector('span').innerHTML=text}
function show(div){div.classList.remove('hidden')}

function setplayer(div,text,team){
  show(div)
  set(div,text+` (team ${team})`)
}

function sort(maps){
  maps.sort((a,b)=>a.getAttribute('civilization').localeCompare(b.getAttribute('civilization')))
  return maps
}

function describe(m){
  if(!m.getAttribute('map')) return
  for(let p of PLAYERS.slice(1,8)) p.classList.add('hidden')
  set(SIDEBAR.querySelector('#mapstyle'),m.getAttribute('map'))
  let neighbors=map.getneighbors(m)
  let i=1
  for(let n of sort(neighbors.filter(n=>n.classList.contains('conquered')))){
    setplayer(PLAYERS[i],n.getAttribute('civilization'),1)
    i+=1
  }
  for(let n of sort(neighbors.filter(n=>!n.classList.contains('conquered')))){
    setplayer(PLAYERS[i],n.getAttribute('civilization'),2)
    i+=1
  }
  let nplayers=neighbors.length+1
  let mapsize=map.SIZES.filter(s=>s>=nplayers)[0]
  set(SIDEBAR.querySelector('#mapsize'),mapsize+' players')
  let d=Number(m.getAttribute('y'))
  set(SIDEBAR.querySelector('#difficulty'),DIFFICULTY[d])
  if(nplayers<mapsize){
    let cost=d-2
    if(cost<1) cost=1
    set(PLAYERS[i],`Pay ${cost} coin(s) for ${campaign.player} ally`)
    show(PLAYERS[i])
  }
}

export function account(){return Number(GOLD.value)}
export function profit(gold=-Infinity){GOLD.value=gold==-Infinity?account()+1:gold}

export function setup(){
  setplayer(PLAYERS[0],campaign.player,1)
  for(let m of map.get()) m.onmouseover=e=>describe(m)
  GOLD.addEventListener('change',()=>permalink.update())
}
