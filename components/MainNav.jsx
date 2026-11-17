import Link from 'next/link';
export default function MainNav() {
  return <nav className="nav">
    <Link className="brand" href="/">Art Explorer</Link>
    <Link href="/artwork">Artworks</Link>
    <Link href="/search">Advanced Search</Link>
    <Link href="/about">About</Link>
    {/* Later: replace this with the Client Component Navbar from Block A2-11 */}
  </nav>;
}
