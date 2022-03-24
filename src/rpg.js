export const SEED=new URL(document.location).searchParams.get('seed')||Date.now().toString()

const RNG=new Math.seedrandom(SEED)

export function roll(min,max){//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
  min=Math.ceil(min)
  max=Math.floor(max)
  return Math.floor(RNG()*(max-min+1)+min)
}

export function chancein(n){return roll(1,n)==1}
export function pick(array){return array[roll(0,array.length-1)]}

export function shuffle(array,clone=true){//adapted fro https://stackoverflow.com/a/6274381
  if(clone) array=Array.from(array)
  for (let i=array.length-1;i>0;i--){
    let j=Math.floor(RNG()*(i+1));//keep semicolon
    [array[i],array[j]]=[array[j],array[i]]
  }
  return array
}
