/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
import Link from "next/link";
import { studentConfig } from "@/student-config";

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">An art journey, one favourite at a time</p>
        <h1>{studentConfig.collectionName}</h1>
        <p className="hero-subtitle">Explore the treasures of The Metropolitan Museum of Art. Save the pieces you love and write down the stories they inspire.</p>
        <div className="row hero-actions">
          <Link className="button" href="/artwork">Explore the collection</Link>
          <Link className="button secondary" href="/favorites">My Favourites</Link>
        </div>
        <p className="muted small">Featured search theme: {studentConfig.initialSearch}</p>
        <div className="hero-art" aria-hidden="true"><span>✳</span><span>✦</span><span>✺</span></div>
      </section>
      <div className="feature-grid">
        <section className="feature-tile"><span className="feature-icon" aria-hidden="true">⌕</span><h2>Discover</h2><p>Find beautiful works with the public museum search and artwork detail pages.</p></section>
        <section className="feature-tile"><span className="feature-icon" aria-hidden="true">♡</span><h2>Collect</h2><p>Sign in and save personal favourites linked to your own account.</p></section>
        <section className="feature-tile"><span className="feature-icon" aria-hidden="true">✎</span><h2>Remember</h2><p>Add notes and keep your collection safely stored in MongoDB Atlas.</p></section>
      </div>
    </>
  );
}
