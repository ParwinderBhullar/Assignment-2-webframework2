/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
import { Suspense } from "react";
import ArtworkBrowser from "@/components/ArtworkBrowser";
export default function Artworks() {
  return <>
    <div className="page-heading"><div><p className="eyebrow">Discover something beautiful</p><h1>Browse artworks</h1><p className="muted">Explore The Met's public collection. Save your favourite pieces when you're logged in.</p></div></div>
    <Suspense fallback={<p>Loading search...</p>}><ArtworkBrowser /></Suspense>
  </>;
}
