/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";

// Artwork is a prop supplied by ArtworkList; favourite state comes from Context.
export default function ArtworkCard({ artwork }) {
  return (
    <article className="card">
      <div className="art-picture">
        {artwork.primaryImageSmall ? (
          <img className="artImage" src={artwork.primaryImageSmall} alt={artwork.title || "Artwork"} />
        ) : <div className="noImage">No image</div>}
      </div>
      <p className="eyebrow card-kicker">Met object #{artwork.objectID}</p>
      <h3>{artwork.title || "Untitled"}</h3>
      <p className="muted card-artist">{artwork.artistDisplayName || "Unknown artist"}</p>
      <div className="card-actions">
        <Link className="card-details" href={`/artwork/${artwork.objectID}`}>View details</Link>
        <FavoriteButton artworkId={artwork.objectID} />
      </div>
    </article>
  );
}
