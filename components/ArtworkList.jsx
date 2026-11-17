import ArtworkCard from './ArtworkCard';
export default function ArtworkList({artworks}){if(artworks.length===0)return <p className="muted">No artworks found. Try another search.</p>;return <div className="grid">{artworks.map(a=><ArtworkCard key={a.objectID} artwork={a}/>)}</div>}
