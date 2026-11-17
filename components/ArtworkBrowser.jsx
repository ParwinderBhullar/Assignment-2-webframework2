'use client';
import {useState,useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import ArtworkList from './ArtworkList';
import {getArtwork,searchArtworkIDs} from '@/lib/metApi';
import {studentConfig} from '@/student-config';
export default function ArtworkBrowser(){
 const params=useSearchParams();const initial=params.get('q')||studentConfig.initialSearch;
 const [input,setInput]=useState(initial);const [query,setQuery]=useState(initial);
 const [artworks,setArtworks]=useState([]);const [loading,setLoading]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{let active=true;async function load(){setLoading(true);setError('');try{const ids=await searchArtworkIDs(query,{titleOnly:params.get('title')==='true'});const results=await Promise.all(ids.map(id=>getArtwork(id).catch(()=>null)));if(active)setArtworks(results.filter(Boolean));}catch{if(active)setError('Could not load artwork. Try again.');}finally{if(active)setLoading(false)}}load();return()=>{active=false}},[query,params]);
 return <section className="panel"><form className="row" onSubmit={e=>{e.preventDefault();setQuery(input.trim())}}><input className="field" aria-label="Search artworks" value={input} onChange={e=>setInput(e.target.value)}/><button className="button" type="submit">Search</button></form>{loading&&<p>Loading artwork...</p>}{error&&<p className="error">{error}</p>}{!loading&&!error&&<ArtworkList artworks={artworks}/>}</section>
}
