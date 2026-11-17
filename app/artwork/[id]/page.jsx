/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtwork } from "@/lib/metApi";
import FavoriteButton from "@/components/FavoriteButton";

export default async function ArtworkDetailPage({ params }) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) notFound();
  return (
    <section className="panel artwork-detail">
      <Link href="/artwork">← Back to artworks</Link>
      <div className="detail-layout">
        <div className="detail-picture">
          {artwork.primaryImageSmall ? <img className="detailImage" src={artwork.primaryImageSmall} alt={artwork.title || "Artwork"} /> : <div className="noImage">No image available</div>}
        </div>
        <div>
          <p className="eyebrow">The Met Collection · #{artwork.objectID}</p>
          <h1>{artwork.title || "Untitled"}</h1>
          <p className="muted">{artwork.artistDisplayName || "Unknown artist"} · {artwork.objectDate || "Unknown date"}</p>
          {artwork.medium && <p><strong>Medium:</strong> {artwork.medium}</p>}
          {artwork.department && <p><strong>Department:</strong> {artwork.department}</p>}
          <FavoriteButton artworkId={artwork.objectID} />
        </div>
      </div>
    </section>
  );
}
