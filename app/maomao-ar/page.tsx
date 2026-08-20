import Image from "next/image";
import Link from "next/link";

const appStoreUrl = "https://apps.apple.com/app/id6800217406";
const mediaRoot = "/maomao-ar/media";

const storyCards = [
  {
    step: "01",
    title: "Meimei became MaoMao",
    copy: "The real cat behind the app is Meimei — my boy cat, rebuilt through a lot of 3D iteration.",
    image: `${mediaRoot}/from-doodle.jpg`,
    href: "https://www.youtube.com/shorts/r1cbMVmDRNs",
  },
  {
    step: "02",
    title: "Then he stepped outside",
    copy: "AR gave him a floor, a patch of grass, and an entire world to inspect.",
    image: `${mediaRoot}/on-grass.jpg`,
    href: "https://www.youtube.com/shorts/ec6F-vkkR6U",
  },
  {
    step: "03",
    title: "Of course he found the fish",
    copy: "The first thing MaoMao chose to investigate was the aquarium on my screen.",
    image: `${mediaRoot}/found-fish.jpg`,
    href: "https://www.youtube.com/shorts/v1ZtH9QrBsE",
  },
];

const sightings = [
  {
    title: "He needs a little touch",
    image: `${mediaRoot}/needs-touch.jpg`,
    href: "https://www.youtube.com/shorts/XyH_8KzExo0",
  },
  {
    title: "A walk down the street",
    image: `${mediaRoot}/walking-street.jpg`,
    href: "https://www.youtube.com/shorts/LeLFdycC0A8",
  },
  {
    title: "Meeting his other self",
    image: `${mediaRoot}/meets-herself.jpg`,
    href: "https://www.youtube.com/shorts/U6uUi72wZWY",
  },
  {
    title: "What is he looking at?",
    image: `${mediaRoot}/what-is-he-looking-at.jpg`,
    href: "https://www.youtube.com/shorts/pHHEd-e-C84",
  },
];

export default function Home() {
  return (
    <main className="maomao-ar-page">
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="MaoMao AR home">
          <Image src={`${mediaRoot}/app-icon.jpg`} alt="" width={512} height={512} />
          <span>MaoMao AR</span>
        </a>
        <div className="nav-links">
          <a href="#play">Play</a>
          <a href="#story">Story</a>
          <a href="#sightings">Videos</a>
          <Link href="/">Echo Carrie</Link>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> Now on the App Store
          </p>
          <h1>A tiny 3D cat.<br />Now in your room.</h1>
          <p className="lede">
            Place MaoMao on your floor or desk. Call him over, give him a pet,
            and let a little more cat into your day.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href={appStoreUrl} target="_blank" rel="noreferrer">
              View on the App Store <span aria-hidden="true">↗</span>
            </a>
            <a className="text-button" href="https://www.youtube.com/@echo.carrie/shorts" target="_blank" rel="noreferrer">
              Watch MaoMao move <span aria-hidden="true">→</span>
            </a>
          </div>
          <ul className="quick-facts" aria-label="App details">
            <li>Free</li>
            <li>iPhone</li>
            <li>iOS 17+</li>
            <li>No account</li>
          </ul>
        </div>

        <div className="hero-visual" aria-label="MaoMao walking outdoors in augmented reality">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="phone-frame">
            <Image
              src={`${mediaRoot}/on-grass.jpg`}
              alt="MaoMao, a small 3D cat, standing on grass in augmented reality"
              width={1280}
              height={720}
              priority
              sizes="(max-width: 900px) 76vw, 360px"
            />
            <div className="camera-pill">AR · LIVE</div>
          </div>
          <div className="callout callout-top">Tap to place</div>
          <div className="callout callout-bottom">Pet · Purr · Play</div>
        </div>
      </section>

      <section className="story-strip" aria-label="MaoMao introduction">
        <p>He can sit. He can nap. He can walk toward you.</p>
        <p className="story-emphasis">And yes, he will investigate your screens.</p>
      </section>

      <section className="play-section" id="play">
        <div className="section-heading">
          <p className="section-kicker">A small cat with a real presence</p>
          <h2>Not a filter.<br />A tiny roommate.</h2>
          <p>
            MaoMao is placed on a real surface through AR. Walk around him,
            move closer, or call him over. He stays in the room with you.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card lime-card">
            <span className="feature-number">01</span>
            <div>
              <h3>Call him over</h3>
              <p>Tap Call and watch MaoMao walk across your floor toward you.</p>
            </div>
          </article>
          <article className="feature-card photo-card">
            <Image
              src={`${mediaRoot}/lovely-kitty.jpg`}
              alt="MaoMao standing close to the camera in AR"
              width={1280}
              height={720}
              sizes="(max-width: 900px) calc(100vw - 40px), 380px"
            />
            <div className="photo-card-copy">
              <span className="feature-number">02</span>
              <div>
                <h3>Give him a pet</h3>
                <p>Tap MaoMao and listen for the purr.</p>
              </div>
            </div>
          </article>
          <article className="feature-card cream-card">
            <span className="feature-number">03</span>
            <div>
              <h3>Make the moment yours</h3>
              <p>Turn, resize, sit, lie down — then take an AR photo worth keeping.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="making-section" id="story">
        <div className="section-heading compact-heading">
          <p className="section-kicker">How MaoMao got here</p>
          <h2>From doodle<br />to your floor.</h2>
        </div>
        <div className="story-cards">
          {storyCards.map((card) => (
            <a className="story-card" href={card.href} target="_blank" rel="noreferrer" key={card.title}>
              <div className="story-image">
                <Image
                  src={card.image}
                  alt=""
                  width={1280}
                  height={720}
                  sizes="(max-width: 900px) calc(100vw - 64px), 380px"
                />
                <span className="play-mark" aria-hidden="true">▶</span>
              </div>
              <span className="story-step">{card.step}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="app-section">
        <div className="screenshots" aria-label="MaoMao AR App Store screenshots">
          <Image className="screen screen-one" src={`${mediaRoot}/app-screen-1.jpg`} alt="MaoMao AR welcome screen" width={645} height={1398} sizes="255px" />
          <Image className="screen screen-two" src={`${mediaRoot}/app-screen-2.jpg`} alt="MaoMao placed in a real room" width={645} height={1398} sizes="255px" />
          <Image className="screen screen-three" src={`${mediaRoot}/app-screen-3.jpg`} alt="MaoMao AR interaction controls" width={645} height={1398} sizes="255px" />
        </div>
        <div className="app-copy">
          <Image className="large-app-icon" src={`${mediaRoot}/app-icon.jpg`} alt="MaoMao AR app icon" width={512} height={512} />
          <p className="section-kicker">MaoMao AR: 3D Cat Pet</p>
          <h2>Bring home<br />a little cat energy.</h2>
          <p>
            Free on iPhone. No account, no profile, and no personal data collected.
            Just point your camera at a flat surface and let MaoMao in.
          </p>
          <a className="primary-button" href={appStoreUrl} target="_blank" rel="noreferrer">
            View on the App Store <span aria-hidden="true">↗</span>
          </a>
          <p className="requirements">Requires iOS 17 or later and an ARKit-compatible iPhone.</p>
        </div>
      </section>

      <section className="sightings-section" id="sightings">
        <div className="section-heading sightings-heading">
          <div>
            <p className="section-kicker">MaoMao sightings</p>
            <h2>Follow the cat.</h2>
          </div>
          <a className="text-button" href="https://www.youtube.com/@echo.carrie/shorts" target="_blank" rel="noreferrer">
            All videos on YouTube <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="sightings-grid">
          {sightings.map((video) => (
            <a href={video.href} target="_blank" rel="noreferrer" className="sighting-card" key={video.title}>
              <Image src={video.image} alt="" width={1280} height={720} sizes="(max-width: 560px) 45vw, (max-width: 900px) 50vw, 290px" />
              <div>
                <span>{video.title}</span>
                <span aria-hidden="true">↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <Image src={`${mediaRoot}/app-icon.jpg`} alt="" width={512} height={512} />
        <p>There is room for one small cat.</p>
        <h2>Let MaoMao in.</h2>
        <a className="primary-button" href={appStoreUrl} target="_blank" rel="noreferrer">
          Download free <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer>
        <div className="footer-brand">
          <span>MaoMao AR</span>
          <p>A tiny 3D cat by Echo Carrie.</p>
        </div>
        <div className="footer-links">
          <a href="https://www.youtube.com/@echo.carrie" target="_blank" rel="noreferrer">YouTube</a>
          <Link href="/">Echo Carrie</Link>
          <a href="https://maomao.echoscarrie.com/ar/privacy.html" target="_blank" rel="noreferrer">Privacy</a>
        </div>
        <p>© 2026 Xia Chen</p>
      </footer>
    </main>
  );
}
