import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "War Toy Kingdom — Votre règne commence",
  description:
    "Bâtissez votre armée, recrutez vos commandants et forgez votre légende.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
