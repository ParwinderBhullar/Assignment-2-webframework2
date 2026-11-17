const ROOT='https://collectionapi.metmuseum.org/public/collection';
export async function getArtwork(id) {
  const number=Number(id); if(!Number.isInteger(number)||number<=0) return null;
  const res=await fetch(`${ROOT}/v1/objects/${number}`,{next:{revalidate:3600}});
  if(!res.ok) return null;
  return res.json();
}
export async function searchArtworkIDs(keyword,{titleOnly=false,limit=6}={}) {
  const q=String(keyword||'').trim(); if(q.length<2) return [];
  const params=new URLSearchParams({q,limit:String(limit)});
  if(titleOnly) params.set('title','true');
  const res=await fetch(`${ROOT}/v1.1/search?${params.toString()}`,{cache:'no-store'});
  if(!res.ok) throw new Error('Museum search unavailable');
  const result=await res.json(); return Array.isArray(result.objectIDs)?result.objectIDs.slice(0,limit):[];
}
