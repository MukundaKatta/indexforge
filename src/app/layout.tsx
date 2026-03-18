import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IndexForge — RAG Pipeline Builder",
  description: "Build, test, and evaluate RAG pipelines with data connectors, chunking strategies, and query optimization",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
    </html>
  );
}
