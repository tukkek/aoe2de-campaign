import * as sidebar from './sidebar.js'
import * as rpg from './rpg.js'
import * as permalink from './permalink.js'

export const SIZES=[2,3,4,6,8]

const MAP=document.querySelector('#map')

export function get(x=-1,y=-1){
  if(x==-1&&y==-1) return Array.from(MAP.querySelectorAll('.hex'))
  if(x==-1) return Array.from(MAP.querySelectorAll(`.hex[y="${y}"]`))
  if(y==-1) return Array.from(MAP.querySelectorAll(`.hex[x="${x}"]`))
  return MAP.querySelector(`.hex[x="${x}"][y="${y}"]`)
}

export function conquer(hex,profit=true){
  if(!hex.getAttribute('map')) return
  if(hex.classList.toggle('conquered')&&profit)
    for(let i=0;i<Number(hex.getAttribute('value'));i++) sidebar.profit()
  permalink.update()
}

function map(hexes){return hexes.filter(a=>a&&a.getAttribute('map'))}

export function getneighbors(hex,maps=true){
  let n=[]
  let origin=['x','y'].map(coordinate=>Number(hex.getAttribute(coordinate)))
  for(let x=origin[0]-1;x<=origin[0]+1;x++)
    for(let y=origin[1]-1;y<=origin[1]+1;y++)
      n.push([x,y])
  n.push(...[[origin[0],origin[1]-2],[origin[0],origin[1]+2]])
  n=n.filter(xy=>xy[0]>=0&&xy[1]>=0).map(xy=>get(xy[0],xy[1])).filter(h=>h)
  return maps?map(n):n
}

export function setup(){for(let m of get()) m.onclick=e=>conquer(m)}

function appraise(area){
  let y=Number.parseInt(area.getAttribute('y'))
  if(area.getAttribute('y')=='0'){
    area.setAttribute('value',0)
    return
  }
  let value=Math.pow(2,y)
  value=rpg.randomize(value)
  let digits=0
  while(value>10){
    value/=10
    digits+=1
  }
  value=Math.round(value)*Math.pow(10,digits)
  area.setAttribute('value',value)
  let b=area.querySelector('button')
  b.textContent='$'+value
  b.onclick=(e)=>{
    if(sidebar.pay(value)) conquer(area,false)
    e.stopPropagation()
  }
}

export function draw(){
  let all=get()
  for(let m of all) m.setAttribute('map','land')
  var flood=[rpg.pick(all)]
  while(flood.length<8){
    var n=getneighbors(rpg.pick(flood))
    n=n.filter(n=>n&&n.getAttribute('map')=='land'&&flood.indexOf(n)<0)
    if(n.length) flood.push(rpg.pick(n))
  }
  for(var f of flood){
    f.setAttribute('map','water')
    for(let n of getneighbors(f).filter(n=>flood.indexOf(n)<0)) n.setAttribute('map','mixed')
  }
  for(let a of all){
    if(rpg.chancein(3)) a.removeAttribute('map')
    else appraise(a)
  }
  for(let ally of map(get(-1,0))){
    conquer(ally,false)
    let neighbors=getneighbors(ally,false).filter(n=>!n.getAttribute('map')&&n.getAttribute('y')<=1)
    for(let n of neighbors){
      n.setAttribute('map','land')
      conquer(n,false)
    }
  }
  for(let a of all){
    if(!a.getAttribute('map')||a.classList.contains('conquered')) continue
    let coordinate=[a.getAttribute('x'),a.getAttribute('y')]
    if(permalink.CONQUERED.has(coordinate.toString())) conquer(a,false)
  }
}

export function getconquered(){return get().filter(c=>c.classList.contains('conquered'))}
