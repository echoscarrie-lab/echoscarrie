import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://echoscarrie.com"),
  title: "Echo Carrie — A website that listens first",
  description:
    "Leave a thought. Carrie's world will answer with a mirror, a turn, or a door.",
  openGraph: {
    title: "Echo Carrie",
    description: "Leave a thought. See what echoes back.",
    type: "website",
    siteName: "Echo Carrie",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Echo Carrie — Leave a thought. See what echoes back." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo Carrie",
    description: "Leave a thought. See what echoes back.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
