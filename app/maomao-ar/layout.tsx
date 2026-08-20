import type { Metadata } from "next";
import "./maomao-ar.css";

const title = "MaoMao AR — A tiny 3D cat in your room";
const description =
  "Place MaoMao in your space, call him over, pet him, and capture a little cat magic in augmented reality.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/maomao-ar/",
  },
  openGraph: {
    title,
    description,
    url: "https://echoscarrie.com/maomao-ar/",
    type: "website",
    siteName: "Echo Carrie",
    images: [
      {
        url: "/maomao-ar/og.png",
        width: 1730,
        height: 909,
        alt: "MaoMao AR — A tiny 3D cat in your room",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/maomao-ar/og.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MaoMao AR: 3D Cat Pet",
  operatingSystem: "iOS 17 or later",
  applicationCategory: "EntertainmentApplication",
  description,
  url: "https://echoscarrie.com/maomao-ar/",
  downloadUrl: "https://apps.apple.com/app/id6800217406",
  image: "https://echoscarrie.com/maomao-ar/og.png",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Person",
    name: "Carrie",
    url: "https://echoscarrie.com/",
  },
};

export default function MaoMaoArLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
