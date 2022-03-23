import * as campaign from './campaign.js'
import * as map from './map.js'

const DIFFICULTY=['easiest','standard','moderate','hard','hardest','extreme','extreme']
const SIDEBAR=document.querySelector('#sidebar')
const PLAYERS=Array.from(SIDEBAR.querySelectorAll('div')).slice(0,8)
const GOLD=SIDEBAR.querySelector('input')

function set(div,text){div.querySelector('span').innerHTML=text}
function setplayer(div,text,team){set(div,text+` (team ${team}).`)}

function describe(m){
  if(!m.getAttribute('map')) return
  for(let p of PLAYERS.slice(1,8)) set(p,'none')
  set(SIDEBAR.querySelector('#mapstyle'),m.getAttribute('map'))
  let neighbors=map.getneighbors(m)
  let i=1
  for(let n of neighbors.filter(n=>n.classList.contains('conquered'))){
    setplayer(PLAYERS[i],n.getAttribute('civilization'),1)
    i+=1
  }
  for(let n of neighbors.filter(n=>!n.classList.contains('conquered'))){
    setplayer(PLAYERS[i],n.getAttribute('civilization'),2)
    i+=1
  }
  let nplayers=neighbors.length+1
  let mapsize=map.SIZES.filter(s=>s>=nplayers)[0]
  set(SIDEBAR.querySelector('#mapsize'),mapsize)
  let d=Number(m.getAttribute('y'))
  set(SIDEBAR.querySelector('#difficulty'),DIFFICULTY[d])
  if(nplayers<mapsize){
    let cost=d-2
    if(cost<1) cost=1
    set(PLAYERS[i],`Pay ${cost} coin(s) to add a ${campaign.player} ally to your team`)
  }
}

export function profit(){
  GOLD.value=Number(GOLD.value)+1
}

export function setup(){
  setplayer(PLAYERS[0],campaign.player,1)
  for(let m of map.get()) m.onmouseover=e=>describe(m)
  GOLD.value=1
}
