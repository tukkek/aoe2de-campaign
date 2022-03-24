import * as rpg from './rpg.js'
import * as sidebar from './sidebar.js'
import * as map from './map.js'

export const CONQUERED=new Set()//set of [map.x,map.y].toString()]

const LINK=document.querySelector('#permalink')
const BASE=new URL(document.location)

export function update(){
  let u=new URL(BASE)
  let p=u.searchParams
  p.set('seed',rpg.seed)
  p.set('gold',sidebar.account())
  for(let c of map.getconquered())
    p.append('conquered',c.getAttribute('x')+'x'+c.getAttribute('y'))
  LINK.href=u
}

export function load(){
  for(let k of [...BASE.searchParams.keys()])
    BASE.searchParams.delete(k)
  document.querySelector('#freshlink').href=BASE
  let p=new URL(document.location).searchParams
  if(!p.has('seed')) return
  rpg.setseed(p.get('seed'))
  sidebar.profit(p.get('gold'))
  for(let c of p.getAll('conquered'))
    CONQUERED.add(c.split('x').toString())
}
