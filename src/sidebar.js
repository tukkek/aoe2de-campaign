import * as campaign from './campaign.js'
import * as map from './map.js'
import * as permalink from './permalink.js'

const DIFFICULTY=['easiest','easiest','standard','moderate','hard','hardest','extreme','extreme']
const SIDEBAR=document.querySelector('#sidebar')
const PLAYERS=Array.from(SIDEBAR.querySelectorAll('div')).slice(0,8)
const GOLD=SIDEBAR.querySelector('input')
const PURCHASE=SIDEBAR.querySelector('#purchase span')
const HELP=`
  - Generate new campaigns as needed until you are ready to begin.
  - Green hexes are allies that will reinforce your team when you invade their neighbors.
  - Go from the bottom green hexes to the top, choosing your own path, one neighboring area at a time.
  - To conquer a hex, play a match against the AI. Hover with the cursor to see match setup details.
  - After winning a match, click the respective hex to conquer it as a new ally.
  - Victories reward you with gold! Use the gold to bribe hostile territories into becoming your allies.
  - Bribing a territory doesn't reward gold, make sure to alter the gold value correctly.
  - To save your campaign progress, use the permalink function below (then bookmark the tab, for example).
  - You win the campaign after conquering any Extreme difficulty hex.
  `.trim()

function set(div,text){div.querySelector('span').innerHTML=text}
function show(div){div.classList.remove('hidden')}

function setplayer(div,text,team){
  show(div)
  set(div,text+` (team ${team})`)
}

function compare(a,b){
  a=a.getAttribute('civilization')
  if(a==campaign.player) return -1
  b=b.getAttribute('civilization')
  if(b==campaign.player) return +1
  return a.localeCompare(b)
}

function describe(m){
  if(!m.getAttribute('map')) return
  for(let p of PLAYERS.slice(1,8)) p.classList.add('hidden')
  set(SIDEBAR.querySelector('#mapstyle'),m.getAttribute('map'))
  let neighbors=map.getneighbors(m)
  let i=1
  for(let n of neighbors.filter(n=>n.classList.contains('conquered')).sort(compare)){
    setplayer(PLAYERS[i],n.getAttribute('civilization'),1)
    i+=1
  }
  for(let n of neighbors.filter(n=>!n.classList.contains('conquered')).sort(compare)){
    setplayer(PLAYERS[i],n.getAttribute('civilization'),2)
    i+=1
  }
  let nplayers=neighbors.length+1
  let mapsize=map.SIZES.filter(s=>s>=nplayers)[0]
  set(SIDEBAR.querySelector('#mapsize'),mapsize+' players')
  let d=Number(m.getAttribute('y'))
  set(SIDEBAR.querySelector('#difficulty'),DIFFICULTY[d])
  PURCHASE.textContent=Number(m.getAttribute('value'))
}

export function account(){return Number(GOLD.value)}
export function profit(gold=-Infinity){GOLD.value=gold==-Infinity?account()+1:gold}

export function setup(){
  setplayer(PLAYERS[0],campaign.player,1)
  for(let m of map.get()) m.onmouseover=e=>describe(m)
  GOLD.addEventListener('change',()=>permalink.update())
  document.querySelector('#help').onclick=()=>window.alert(HELP)
}
