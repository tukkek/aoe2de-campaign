import * as sidebar from './sidebar.js'
import * as rpg from './rpg.js'
import * as permalink from './permalink.js'

export const SIZES=[2,3,4,6,8]

const MAP=document.querySelector('#map')

export function get(x=-Number.MAX_VALUE,y=-Number.MAX_VALUE){
  if(x==-Number.MAX_VALUE&&y==-Number.MAX_VALUE) return Array.from(MAP.querySelectorAll('.hex'))
  if(x==-Number.MAX_VALUE) return Array.from(MAP.querySelectorAll(`.hex[y="${y}"]`))
  if(y==-Number.MAX_VALUE) return Array.from(MAP.querySelectorAll(`.hex[x="${x}"]`))
  return MAP.querySelector(`.hex[x="${x}"][y="${y}"]`)
}

export function conquer(hex,profit=true){
  if(!hex.getAttribute('map')) return
  if(hex.classList.toggle('conquered')&&profit) sidebar.profit()
  permalink.update()
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

export function setup(){for(let m of get()) m.onclick=e=>conquer(m)}

export function draw(){
  let all=get()
  for(let m of all) m.setAttribute('map','land')
  var flood=[rpg.pick(all)]
  while(flood.length<8){
    var n=getneighbors(rpg.pick(flood))
    n=n.filter(n=>n.getAttribute('map')=='land'&&flood.indexOf(n)<0)
    if(n.length) flood.push(rpg.pick(n))
  }
  for(var f of flood){
    f.setAttribute('map','water')
    for(let n of getneighbors(f).filter(n=>flood.indexOf(n)<0)) n.setAttribute('map','mixed')
  }
  for(let a of all){
    if(rpg.chancein(3)){
      a.removeAttribute('map')
      continue
    }
    let coordinate=[a.getAttribute('x'),a.getAttribute('y')]
    if(permalink.CONQUERED.has(coordinate.toString())) conquer(a,false)
  }
}

export function getconquered(){return get().filter(c=>c.classList.contains('conquered'))}
