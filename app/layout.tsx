import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://echoscarrie.com"),
  title: "Echo Carrie — Say something real. This place answers.",
  description:
    "A private, interactive listening surface. Leave one honest sentence and receive a mirror, a turn, or a door into Carrie's world.",
  openGraph: {
    title: "Echo Carrie — This place answers",
    description: "Say something real. See what echoes back.",
    type: "website",
    siteName: "Echo Carrie",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Echo Carrie — Say something real. This place answers." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo Carrie",
    description: "Say something real. See what echoes back.",
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
