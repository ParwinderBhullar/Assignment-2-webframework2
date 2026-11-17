/* ITE5425 — Mastery Assignment 2: My Art Explorer
 * I declare that this work is my own and conforms to Humber Academic Policy.
 * I have not copied or distributed another student's implementation.
 * I have disclosed all generative-AI assistance in ai-use.md.
 * Name: __________________ Student ID: ______________ Date: __________
 */
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import AccountNav from "@/components/AccountNav";

export const metadata = {
  title: "My Art Explorer | Nature & Light",
  description: "Explore artworks from The Met and create a personal collection with saved notes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FavoritesProvider>
            <AccountNav />
            <main className="container">{children}</main>
            <footer className="site-footer">A student project for ITE5425 · Artwork information provided by The Metropolitan Museum of Art Collection API.</footer>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
