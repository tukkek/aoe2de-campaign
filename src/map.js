import * as sidebar from './sidebar.js'

const MAP=document.querySelector('#map')

export function get(x=-Number.MAX_VALUE,y=-Number.MAX_VALUE){
  if(x==-Number.MAX_VALUE&&y==-Number.MAX_VALUE) return Array.from(MAP.querySelectorAll('.hex'))
  if(x==-Number.MAX_VALUE) return Array.from(MAP.querySelectorAll(`.hex[y="${y}"]`))
  if(y==-Number.MAX_VALUE) return Array.from(MAP.querySelectorAll(`.hex[x="${x}"]`))
  return MAP.querySelector(`.hex[x="${x}"][y="${y}"]`)
}

function click(hex){
  if(!hex.getAttribute('map')) return
  if(hex.classList.toggle('conquered')) sidebar.profit()
}

export function getneighbors(hex){
  let n=[]
  let origin=['x','y'].map(coordinate=>Number(hex.getAttribute(coordinate)))
  for(let x=origin[0]-1;x<=origin[0]+1;x++)
    for(let y=origin[1]-1;y<=origin[1]+1;y++)
      n.push(get(x,y))
  n.push(...[get(origin[0],origin[1]-2),get(origin[0],origin[1]+2)])
  return n.filter(n=>n!=null&&n.getAttribute('map'))
}

export function setup(){for(let m of get()) m.onclick=e=>click(m)}
