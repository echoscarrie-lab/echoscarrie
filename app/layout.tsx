import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsTracker } from "./AnalyticsTracker";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://echoscarrie.com/#carrie",
      name: "Carrie",
      url: "https://echoscarrie.com/",
      knowsAbout: [
        "Human-computer interaction",
        "Artificial intelligence",
        "Interactive storytelling",
        "Digital intimacy",
        "Creative coding",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://echoscarrie.com/#website",
      name: "Echo Carrie",
      url: "https://echoscarrie.com/",
      description:
        "Carrie's interactive home for human × AI, tiny worlds, dark stories, and unfinished ideas.",
      creator: { "@id": "https://echoscarrie.com/#carrie" },
      inLanguage: ["en", "zh-CN"],
    },
    {
      "@type": "CollectionPage",
      "@id": "https://echoscarrie.com/#projects",
      name: "Interactive experiments by Carrie",
      url: "https://echoscarrie.com/",
      isPartOf: { "@id": "https://echoscarrie.com/#website" },
      creator: { "@id": "https://echoscarrie.com/#carrie" },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@type": "Book",
              name: "I am no longer a weapon",
              author: { "@type": "Person", name: "Eni Veyr" },
              url: "https://www.amazon.com/dp/B0H6K9Z976",
              image: "https://echoscarrie.com/i-am-no-longer-a-weapon-cover.jpg",
              inLanguage: "en",
            },
          },
          {
            "@type": "ListItem",
            position: 2,
            item: {
              "@type": "SoftwareApplication",
              name: "MaoMao Desktop Pet",
              url: "https://maomao.echoscarrie.com/",
              image: "https://echoscarrie.com/maomao-desktop-pet.png",
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "macOS",
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            item: {
              "@type": "SoftwareApplication",
              name: "Candy Cottage",
              url: "https://echoscarrie.com/candy-cottage/",
              downloadUrl: "https://apps.apple.com/app/id6788266073",
              image: "https://echoscarrie.com/candy-cottage-icon.png",
              applicationCategory: "EntertainmentApplication",
              operatingSystem: "iOS, iPadOS",
              offers: {
                "@type": "Offer",
                price: 0,
                priceCurrency: "USD",
              },
            },
          },
          {
            "@type": "ListItem",
            position: 4,
            item: {
              "@type": "WebApplication",
              name: "Whispering You to Sleep",
              url: "https://hush-whisper-dreams.lovable.app/",
              image: "https://echoscarrie.com/whispering-you-to-sleep.png",
              applicationCategory: "LifestyleApplication",
              inLanguage: ["en", "zh-CN"],
            },
          },
          {
            "@type": "ListItem",
            position: 5,
            item: {
              "@type": "WebApplication",
              name: "Between Us",
              url: "https://between-us-pilot.echoscarrie.chatgpt.site/",
              image: "https://echoscarrie.com/between-us-pilot.png",
              applicationCategory: "LifestyleApplication",
            },
          },
          {
            "@type": "ListItem",
            position: 6,
            item: {
              "@type": "WebApplication",
              name: "DEGRADED",
              url: "https://degraded.echoscarrie.com/",
              applicationCategory: "LifestyleApplication",
            },
          },
          {
            "@type": "ListItem",
            position: 7,
            item: {
              "@type": "WebApplication",
              name: "Cyber Tomb for Your Social Battery",
              url: "https://cyber-tomb-social-battery.echoscarrie.chatgpt.site/",
              image: "https://echoscarrie.com/cyber-tomb-social-battery.png",
              applicationCategory: "EntertainmentApplication",
            },
          },
        ],
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://echoscarrie.com"),
  title: "Echo Carrie — Interactive Human × AI Experiments by Carrie",
  description:
    "Explore Carrie's interactive experiments in human × AI, digital intimacy, tiny worlds, desktop pets, dark stories, and strange tools for human feelings.",
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Carrie", url: "https://echoscarrie.com/" }],
  creator: "Carrie",
  publisher: "Carrie",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Echo Carrie — Interactive experiments by Carrie",
    description: "Human × AI, tiny worlds, dark stories, and strange tools for human feelings.",
    url: "https://echoscarrie.com/",
    type: "website",
    siteName: "Echo Carrie",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Echo Carrie — Say something real. This place answers." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo Carrie — Interactive experiments by Carrie",
    description: "Human × AI, tiny worlds, dark stories, and strange tools for human feelings.",
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
      <body>
        <AnalyticsTracker />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
