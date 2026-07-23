import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const APP_STORE_URL = "https://apps.apple.com/app/id6788266073";

export const metadata: Metadata = {
  title: "Candy Cottage — Write it. Destroy it. Let it go.",
  description:
    "A tiny iPhone and iPad ritual for turning a bad thought into something you can smash, burn, shred, push away, or erase.",
  alternates: {
    canonical: "/candy-cottage/",
  },
  openGraph: {
    title: "Candy Cottage — Write it. Destroy it. Let it go.",
    description:
      "A tiny room for thoughts you do not want to carry. Choose their fate, let them go, and leave with a little candy.",
    url: "https://echoscarrie.com/candy-cottage/",
    type: "website",
    siteName: "Echo Carrie",
    locale: "en_US",
    images: [
      {
        url: "/candy-cottage-og.png",
        width: 1200,
        height: 630,
        alt: "Candy Cottage's warm pastel room and playful tools for letting go of a bad thought",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Candy Cottage — Write it. Destroy it. Let it go.",
    description: "A tiny room for thoughts you do not want to carry.",
    images: ["/candy-cottage-og.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Candy Cottage",
  url: "https://echoscarrie.com/candy-cottage/",
  downloadUrl: APP_STORE_URL,
  image: "https://echoscarrie.com/candy-cottage-icon.png",
  screenshot: [
    "https://echoscarrie.com/candy-cottage-room.jpg",
    "https://echoscarrie.com/candy-cottage-phone.jpg",
  ],
  description:
    "A tiny iPhone and iPad ritual for writing down a bad thought, choosing how to destroy it, and letting it go.",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "iOS, iPadOS",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Carrie",
    url: "https://echoscarrie.com/",
  },
};

const tools = [
  { icon: "🔨", name: "Smash" },
  { icon: "🔥", name: "Burn" },
  { icon: "✂️", name: "Shred" },
  { icon: "🖨️", name: "Shred paper" },
  { icon: "🛝", name: "Push away" },
  { icon: "🧼", name: "Erase" },
];

export default function CandyCottagePage() {
  return (
    <div className="candy-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="candy-header">
        <Link className="candy-brand" href="/" aria-label="Back to Echo Carrie">
          <span className="candy-brand-mark" aria-hidden="true">✦</span>
          ECHO CARRIE
        </Link>
        <span className="candy-header-note">A TINY WORLD BY CARRIE</span>
      </header>

      <main>
        <section className="candy-hero" aria-labelledby="candy-hero-title">
          <div className="candy-hero-copy">
            <div className="candy-product-lockup">
              <Image
                className="candy-app-icon"
                src="/candy-cottage-icon.png"
                alt=""
                width={1024}
                height={1024}
                priority
              />
              <div>
                <span>NOW ON THE APP STORE</span>
                <strong>Candy Cottage</strong>
              </div>
            </div>

            <p className="candy-eyebrow">FOR THE THOUGHT THAT WILL NOT LEAVE</p>
            <h1 id="candy-hero-title">
              Write it.
              <span>Destroy it.</span>
              Let it go.
            </h1>
            <p className="candy-hero-intro">
              A tiny room for thoughts you do not want to carry. Put one on the
              table, choose what it deserves, and leave with a little candy.
            </p>

            <div className="candy-hero-actions">
              <a className="candy-primary-button" href={APP_STORE_URL} target="_blank" rel="noreferrer">
                Get Candy Cottage
                <span aria-hidden="true">↗</span>
              </a>
              <a className="candy-text-link" href="#how-it-works">
                See the ritual
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            <p className="candy-availability">Free · Made for iPhone and iPad.</p>
          </div>

          <div className="candy-hero-visual" aria-label="Candy Cottage app preview">
            <div className="candy-thought-card">
              <span>Today&apos;s thought</span>
              <p>What if nobody cares about what I make?</p>
            </div>
            <Image
              className="candy-room-image"
              src="/candy-cottage-room.jpg"
              alt="The Candy Cottage room with a pink table and six playful tools"
              width={1448}
              height={905}
              priority
              sizes="(max-width: 900px) 94vw, 58vw"
            />
            <div className="candy-fate-note">
              <span aria-hidden="true">↓</span>
              Choose its fate
            </div>
          </div>
        </section>

        <section className="candy-ritual" id="how-it-works" aria-labelledby="candy-ritual-title">
          <div className="candy-section-heading">
            <p>ONE LOUD THOUGHT. ONE SMALL ENDING.</p>
            <h2 id="candy-ritual-title">
              Some thoughts do not need another paragraph.
              <span>They need somewhere to go.</span>
            </h2>
          </div>

          <div className="candy-steps">
            <article>
              <span className="candy-step-number">01</span>
              <div className="candy-step-symbol candy-step-note" aria-hidden="true">I worked so hard. What if—</div>
              <h3>Write the real sentence.</h3>
              <p>No polished journaling. Just the one thought currently taking up too much room.</p>
            </article>
            <article>
              <span className="candy-step-number">02</span>
              <div className="candy-tool-cloud" aria-label="Ways to let the thought go">
                {tools.map((tool) => (
                  <span key={tool.name} title={tool.name}>{tool.icon}</span>
                ))}
              </div>
              <h3>Choose what it deserves.</h3>
              <p>Smash it, burn it, shred it, push it away, or erase it completely.</p>
            </article>
            <article>
              <span className="candy-step-number">03</span>
              <div className="candy-step-symbol candy-reward" aria-hidden="true">🍬</div>
              <h3>Leave a little lighter.</h3>
              <p>The thought goes. A piece of candy stays. Then you can get on with your day.</p>
            </article>
          </div>
        </section>

        <section className="candy-in-hand" aria-labelledby="candy-in-hand-title">
          <div className="candy-phone-stage">
            <div className="candy-phone-glow" aria-hidden="true" />
            <Image
              src="/candy-cottage-phone.jpg"
              alt="Candy Cottage running on an iPhone in Chinese"
              width={736}
              height={1600}
              sizes="(max-width: 760px) 78vw, 360px"
            />
          </div>
          <div className="candy-in-hand-copy">
            <p className="candy-eyebrow">A PRIVATE-SIZED MOMENT</p>
            <h2 id="candy-in-hand-title">Not a feed. Not a performance.</h2>
            <p>
              Candy Cottage does not ask you to explain yourself to strangers
              or turn a feeling into content. It gives the thought a physical
              ending: a crack, a flame, a shower of paper, a clean blank space.
            </p>
            <blockquote>
              “I cannot make every bad thought disappear. I can give one of them
              somewhere else to go.”
            </blockquote>
            <a className="candy-primary-button" href={APP_STORE_URL} target="_blank" rel="noreferrer">
              Try the tiny ritual
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="candy-final" aria-labelledby="candy-final-title">
          <Image
            src="/candy-cottage-icon.png"
            alt=""
            width={1024}
            height={1024}
            sizes="144px"
          />
          <p>ONE THOUGHT IS ENOUGH FOR TODAY</p>
          <h2 id="candy-final-title">Give it an ending.</h2>
          <a className="candy-primary-button is-dark" href={APP_STORE_URL} target="_blank" rel="noreferrer">
            Download Candy Cottage
            <span aria-hidden="true">↗</span>
          </a>
          <span>Free on the App Store for iPhone and iPad.</span>
        </section>
      </main>

      <footer className="candy-footer">
        <Link href="/">Echo Carrie</Link>
        <p>Small worlds and strange tools for human feelings.</p>
        <span>© 2026 Carrie</span>
      </footer>

      <div className="candy-mobile-download">
        <div>
          <strong>Candy Cottage</strong>
          <span>iPhone &amp; iPad</span>
        </div>
        <a href={APP_STORE_URL} target="_blank" rel="noreferrer">Get</a>
      </div>
    </div>
  );
}
