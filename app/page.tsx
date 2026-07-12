"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type FrequencyId = "human-ai" | "tiny-worlds" | "after-dark" | "field-notes";
type EchoKind = "MIRROR" | "TURN" | "DOOR";
type MoodId = "tender" | "restless" | "curious" | "heavy" | "bright";

type Frequency = {
  id: FrequencyId;
  number: string;
  title: string;
  subtitle: string;
  prompt: string;
  roomLine: string;
  notes: string[];
};

type Echo = {
  id: string;
  kind: EchoKind;
  text: string;
  frequency: FrequencyId;
  mood: MoodId;
  original: string;
  isChinese: boolean;
  createdAt: number;
};

const HISTORY_KEY = "echo-carrie-history-v2";
const VISIT_KEY = "echo-carrie-visits-v2";
const BOOK_URL = "https://www.amazon.com/dp/B0H6K9Z976";
const MAOMAO_URL = "https://maomao.echoscarrie.com/";
const MAOMAO_APP_URL = "https://apps.apple.com/us/app/maomao-desktop-pet/id6784916029?mt=12";
const HUSH_URL = "https://hush-whisper-dreams.lovable.app/";
const BETWEEN_URL = "https://between-us-pilot.echoscarrie.chatgpt.site/";
const DEGRADED_URL = "https://degraded.echoscarrie.com/";
const CYBER_TOMB_URL = "https://cyber-tomb-social-battery.echoscarrie.chatgpt.site/";

const frequencies: Frequency[] = [
  {
    id: "human-ai",
    number: "01",
    title: "Human × AI",
    subtitle: "The strange intimacy between people and machines.",
    prompt: "Can a machine remember me without really knowing me?",
    roomLine:
      "A room for the uneasy space between useful machines and meaningful company.",
    notes: [
      "Memory is not the same thing as care — but from the inside, they can feel surprisingly close.",
      "The most revealing AI question is often not what the machine can do, but what we ask it to become for us.",
      "A good companion should leave room for your own mind to return.",
    ],
  },
  {
    id: "tiny-worlds",
    number: "02",
    title: "Tiny Worlds",
    subtitle: "Small games, odd pets, and rooms that notice you.",
    prompt: "I want to make a tiny world that feels alive.",
    roomLine:
      "Small things become worlds when they notice time, absence, and your return.",
    notes: [
      "A tiny world does not need endless content. It needs one behavior you did not expect.",
      "The best digital pets are not needy dashboards. They have a life just beyond your control.",
      "Scale down the map; increase the consequences of attention.",
    ],
  },
  {
    id: "after-dark",
    number: "03",
    title: "After Dark",
    subtitle: "Desire, distance, and everything people do not say.",
    prompt: "Why do we miss the things that were never really ours?",
    roomLine:
      "For the sentence underneath the sentence — the one that only appears when the lights go low.",
    notes: [
      "Longing is often less interested in possession than in keeping possibility alive.",
      "What people call chemistry is sometimes simply the relief of being seen without explanation.",
      "There are honest thoughts that only arrive after the sensible ones are asleep.",
    ],
  },
  {
    id: "field-notes",
    number: "04",
    title: "Field Notes",
    subtitle: "Unfinished thoughts from the edge of what comes next.",
    prompt: "I have an idea, but I don't know what it wants to become.",
    roomLine:
      "A place for thoughts that are alive before they are useful, polished, or easy to explain.",
    notes: [
      "An unfinished idea is not a failed plan. It may still be gathering the language it needs.",
      "Notice what keeps returning before deciding what deserves a roadmap.",
      "Some experiments are valuable because they sharpen the question, not because they scale.",
    ],
  },
];

const keywordGroups: Array<{ id: FrequencyId; words: string[] }> = [
  {
    id: "human-ai",
    words: [
      "ai",
      "machine",
      "robot",
      "chatgpt",
      "codex",
      "memory",
      "人工智能",
      "机器",
      "机器人",
      "模型",
      "记得",
      "陪伴",
      "硅基",
    ],
  },
  {
    id: "tiny-worlds",
    words: [
      "game",
      "play",
      "pet",
      "aibi",
      "tiny",
      "world",
      "room",
      "游戏",
      "玩",
      "宠物",
      "艾比",
      "毛毛",
      "小世界",
      "房间",
    ],
  },
  {
    id: "after-dark",
    words: [
      "love",
      "miss",
      "alone",
      "lonely",
      "relationship",
      "desire",
      "leave",
      "爱",
      "想念",
      "孤独",
      "关系",
      "喜欢",
      "舍不得",
      "离开",
    ],
  },
  {
    id: "field-notes",
    words: [
      "future",
      "idea",
      "work",
      "life",
      "why",
      "start",
      "未来",
      "想法",
      "工作",
      "人生",
      "为什么",
      "不知道",
      "开始",
    ],
  },
];

const moodGroups: Array<{ id: MoodId; words: string[] }> = [
  {
    id: "tender",
    words: ["love", "care", "soft", "hold", "miss", "温柔", "喜欢", "爱", "想念", "在乎"],
  },
  {
    id: "restless",
    words: ["stuck", "again", "can't", "cannot", "restless", "卡住", "反复", "焦虑", "停不下来", "怎么办"],
  },
  {
    id: "heavy",
    words: ["sad", "alone", "tired", "lost", "hurt", "难过", "孤独", "累", "失去", "痛"],
  },
  {
    id: "bright",
    words: ["excited", "happy", "finally", "want to", "开心", "兴奋", "终于", "好玩", "想做"],
  },
  {
    id: "curious",
    words: ["why", "what if", "wonder", "maybe", "为什么", "如果", "好奇", "也许", "可能"],
  },
];

const kindCopy: Record<EchoKind, { title: string; note: string }> = {
  MIRROR: { title: "Mirror", note: "Reflect what is hiding inside the sentence." },
  TURN: { title: "Turn", note: "Ask the question that changes its direction." },
  DOOR: { title: "Door", note: "Open the thought into one of Carrie's rooms." },
};

const moodNames: Record<MoodId, { en: string; zh: string }> = {
  tender: { en: "tender", zh: "温柔" },
  restless: { en: "restless", zh: "不安" },
  curious: { en: "curious", zh: "好奇" },
  heavy: { en: "heavy", zh: "沉重" },
  bright: { en: "bright", zh: "明亮" },
};

function hashText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function detectFrequency(message: string) {
  const normalized = message.toLowerCase();
  const scored = keywordGroups.map((group) => ({
    id: group.id,
    score: group.words.reduce(
      (total, word) => total + (normalized.includes(word) ? 1 : 0),
      0,
    ),
  }));
  const strongest = scored.sort((a, b) => b.score - a.score)[0];
  if (strongest.score > 0) return strongest.id;
  return frequencies[hashText(normalized) % frequencies.length].id;
}

function detectMood(message: string) {
  const normalized = message.toLowerCase();
  const found = moodGroups.find((group) =>
    group.words.some((word) => normalized.includes(word)),
  );
  return found?.id ?? "curious";
}

function getSubject(message: string, isChinese: boolean) {
  const normalized = message.toLowerCase();
  const knownWord = keywordGroups
    .flatMap((group) => group.words)
    .find((word) => normalized.includes(word));

  if (knownWord) return knownWord;
  if (isChinese) {
    const cleaned = message.replace(/[，。！？、；：“”‘’\s]/g, "");
    return cleaned.slice(0, 8) || "这件事";
  }

  const stopWords = new Set([
    "about",
    "after",
    "again",
    "been",
    "could",
    "from",
    "have",
    "into",
    "just",
    "like",
    "really",
    "that",
    "there",
    "think",
    "this",
    "what",
    "when",
    "with",
    "would",
  ]);
  const words = normalized.match(/[a-z']{4,}/g) ?? [];
  return words.find((word) => !stopWords.has(word)) ?? "this";
}

function shorten(message: string, limit: number) {
  const clean = message.replace(/\s+/g, " ").trim();
  return clean.length > limit ? `${clean.slice(0, limit - 1)}…` : clean;
}

function createEcho(message: string, kind: EchoKind, turn: number): Echo {
  const isChinese = /[\u3400-\u9fff]/.test(message);
  const frequency = detectFrequency(message);
  const mood = detectMood(message);
  const subject = getSubject(message, isChinese);
  const quote = shorten(message, isChinese ? 34 : 72);
  const index = (hashText(message) + turn) % 3;
  const room = frequencies.find((item) => item.id === frequency) ?? frequencies[0];

  const zhTemplates: Record<EchoKind, string[]> = {
    MIRROR: [
      `“${quote}”——你真正想靠近的，也许不是“${subject}”本身，而是它让你看见的那个自己。`,
      `这句话表面在说“${subject}”，底下却藏着另一句：我希望这件事可以用不同的方式发生。`,
      `我听见的不是一个结论，而是你正在试探：如果认真承认这份${moodNames[mood].zh}，生活会不会移动一点。`,
    ],
    TURN: [
      `如果“${subject}”不是问题，而是一条线索，你觉得它正在把你带向哪里？`,
      `先不问这件事应该怎么办：当你写下“${quote}”时，最不想被别人误解的部分是什么？`,
      `把所有正确答案暂时拿走，你还愿意为“${subject}”保留哪一个真实答案？`,
    ],
    DOOR: [
      `这句话打开了 ${room.title}。门后放着一个问题：${room.prompt}`,
      `“${subject}”在这里不是终点。它更像 ${room.title} 门口的一盏灯，照见那些还没有名字的东西。`,
      `我会把这句话放进 ${room.title}。那里允许念头先活着，不急着证明自己有用。`,
    ],
  };

  const enTemplates: Record<EchoKind, string[]> = {
    MIRROR: [
      `“${quote}” sounds like it is about ${subject}. Underneath, it may be about the version of you that becomes visible beside it.`,
      `The surface of the sentence says ${subject}. The quieter sentence says: I wish this could happen differently.`,
      `This does not sound like a conclusion. It sounds like you are testing what might move if you took this ${moodNames[mood].en} feeling seriously.`,
    ],
    TURN: [
      `What changes if ${subject} is not the problem, but the clue?`,
      `Before asking what to do about it: what part of “${quote}” would you least want someone to misunderstand?`,
      `If every sensible answer disappeared for a minute, what honest answer about ${subject} would remain?`,
    ],
    DOOR: [
      `This sentence opens ${room.title}. Behind it is one question: ${room.prompt}`,
      `${subject} is not the end of this thought. It is a small light outside the door to ${room.title}.`,
      `I would leave this sentence in ${room.title}, where an idea is allowed to stay alive before it proves useful.`,
    ],
  };

  const text = (isChinese ? zhTemplates : enTemplates)[kind][index];

  return {
    id: `${Date.now()}-${turn}`,
    kind,
    text,
    frequency,
    mood,
    original: message,
    isChinese,
    createdAt: Date.now(),
  };
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<"idle" | "listening" | "answered">("idle");
  const [echo, setEcho] = useState<Echo | null>(null);
  const [mode, setMode] = useState<EchoKind>("MIRROR");
  const [error, setError] = useState("");
  const [pulse, setPulse] = useState(0);
  const [history, setHistory] = useState<Echo[]>([]);
  const [visits, setVisits] = useState(1);
  const [memoryReady, setMemoryReady] = useState(false);
  const [openRoom, setOpenRoom] = useState<FrequencyId | null>("human-ai");
  const [copyStatus, setCopyStatus] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const responseRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let nextVisit = 1;
    let storedHistory: Echo[] = [];

    try {
      nextVisit = Number(window.localStorage.getItem(VISIT_KEY) ?? "0") + 1;
      window.localStorage.setItem(VISIT_KEY, String(nextVisit));

      const stored = window.localStorage.getItem(HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Echo[];
        if (Array.isArray(parsed)) storedHistory = parsed.slice(0, 8);
      }
    } catch {
      // The experience still works when browser storage is unavailable.
    }

    const frame = window.requestAnimationFrame(() => {
      setVisits(nextVisit);
      setHistory(storedHistory);
      setMemoryReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!memoryReady) return;
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 8)));
    } catch {
      // Keep the current visit working even when storage is blocked.
    }
  }, [history, memoryReady]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const surface = surfaceRef.current;
    if (!surface || event.pointerType === "touch") return;
    surface.style.setProperty("--cursor-x", `${event.clientX}px`);
    surface.style.setProperty("--cursor-y", `${event.clientY}px`);
  }

  function deliverEcho(thought: string, kind: EchoKind) {
    setError("");
    setCopyStatus("");
    setPhase("listening");
    setPulse((value) => value + 1);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const nextEcho = createEcho(thought, kind, history.length);
      setEcho(nextEcho);
      setHistory((items) => [nextEcho, ...items].slice(0, 8));
      setPhase("answered");
      window.setTimeout(() => responseRef.current?.focus(), 80);
    }, 760);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const thought = message.trim();

    if (!thought) {
      setError("Leave one small thought first. / 先留下一句话。 ");
      textareaRef.current?.focus();
      return;
    }

    deliverEcho(thought, mode);
  }

  function goDeeper() {
    if (!echo) return;
    const kindOrder: EchoKind[] = ["MIRROR", "TURN", "DOOR"];
    const nextKind = kindOrder[(kindOrder.indexOf(echo.kind) + 1) % kindOrder.length];
    setMode(nextKind);
    deliverEcho(echo.original, nextKind);
  }

  function startAgain() {
    setMessage("");
    setEcho(null);
    setPhase("idle");
    setCopyStatus("");
    window.setTimeout(() => textareaRef.current?.focus(), 80);
  }

  function tuneTo(frequency: Frequency) {
    setMessage(frequency.prompt);
    setMode("DOOR");
    setError("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => textareaRef.current?.focus(), 450);
  }

  function enterRoom(id: FrequencyId) {
    setOpenRoom(id);
    window.setTimeout(() => {
      document.getElementById(`room-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }

  async function copyEcho() {
    if (!echo) return;
    try {
      await navigator.clipboard.writeText(`${echo.text}\n\n— Echo Carrie · echoscarrie.com`);
      setCopyStatus(echo.isChinese ? "已复制" : "Copied");
    } catch {
      setCopyStatus(echo.isChinese ? "复制失败" : "Could not copy");
    }
  }

  function clearMemory() {
    try {
      window.localStorage.removeItem(HISTORY_KEY);
      window.localStorage.removeItem(VISIT_KEY);
    } catch {
      // The visible state can still be cleared.
    }
    setHistory([]);
    setVisits(1);
    setEcho(null);
    setPhase("idle");
  }

  const activeFrequency = frequencies.find((item) => item.id === echo?.frequency);
  const arrivalLine = !memoryReady
    ? "Opening a quiet channel…"
    : visits > 1
      ? `Welcome back. Visit ${visits} from this browser.`
      : "First visit. The room is listening.";

  return (
    <main
      className={`echo-site signal-${echo?.frequency ?? "idle"}`}
      ref={surfaceRef}
      onPointerMove={handlePointerMove}
    >
      <div className="ambient-grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Echo Carrie home">
          <span>ECHO</span>
          <i aria-hidden="true">/</i>
          <span>CARRIE</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#listen">Listen</a>
          <a href="#rooms">Rooms</a>
          <a href="#about">Carrie</a>
        </nav>
        <div className="signal-status" aria-label="The echo is listening">
          <span className="status-dot" aria-hidden="true" />
          Signal open
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">This website listens before it speaks.</p>
          <h1>
            Say something real.
            <em>This place answers.</em>
          </h1>
          <p className="hero-intro">
            Most websites ask you to look. This one asks what is moving through
            you — then gives the thought back at a different angle.
          </p>
          <div className="maker-line">
            <span>BY CARRIE</span>
            <p>
              Writing and building where human intimacy meets artificial
              intelligence, small worlds, and unfinished ideas.
            </p>
          </div>
          <div className="arrival-note">
            <span className="arrival-mark" aria-hidden="true">✦</span>
            <div>
              <strong>{arrivalLine}</strong>
              <span>Your words stay on this device. Nothing is uploaded.</span>
            </div>
          </div>
        </div>

        <div className="prompt-zone" ref={formRef} id="listen">
          <div className="echo-rings" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          {pulse > 0 && <span className="submit-pulse" key={pulse} aria-hidden="true" />}

          <form className="echo-console" onSubmit={handleSubmit}>
            <div className="console-topline">
              <div>
                <span className="console-index">01 / LEAVE A SIGNAL</span>
                <label htmlFor="thought">What&apos;s moving through you?</label>
              </div>
              <span className="micro-wave" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>

            <div className="kind-picker" aria-label="Choose how the site should answer">
              {(Object.keys(kindCopy) as EchoKind[]).map((kind) => (
                <button
                  type="button"
                  className={mode === kind ? "is-active" : ""}
                  aria-pressed={mode === kind}
                  key={kind}
                  onClick={() => setMode(kind)}
                >
                  <span>{kindCopy[kind].title}</span>
                  <small>{kindCopy[kind].note}</small>
                </button>
              ))}
            </div>

            <textarea
              ref={textareaRef}
              id="thought"
              value={message}
              maxLength={360}
              rows={3}
              onChange={(event) => {
                setMessage(event.target.value);
                if (error) setError("");
              }}
              placeholder="I've been thinking about... / 我最近一直在想……"
              aria-describedby={error ? "thought-error" : "thought-note"}
            />

            <div className="console-actions">
              <p id={error ? "thought-error" : "thought-note"} className={error ? "form-error" : "privacy-note"}>
                {error || "No account. No audience. Just this moment."}
              </p>
              <span className="character-count" aria-label={`${message.length} of 360 characters`}>
                {message.length.toString().padStart(2, "0")} / 360
              </span>
              <button className="send-button" type="submit" disabled={phase === "listening"}>
                {phase === "listening" ? "Listening…" : `Ask for a ${kindCopy[mode].title}`}
                <span aria-hidden="true">↗</span>
              </button>
            </div>

            <div
              className={`response-space is-${phase}`}
              aria-live="polite"
              aria-atomic="true"
              ref={responseRef}
              tabIndex={phase === "answered" ? -1 : undefined}
            >
              {phase === "idle" && (
                <div className="waiting-copy">
                  <span aria-hidden="true">●</span>
                  <p>The site has not decided what you mean yet.</p>
                </div>
              )}

              {phase === "listening" && (
                <div className="listening-state">
                  <div className="listening-bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <p>Listening for the sentence underneath the sentence…</p>
                </div>
              )}

              {phase === "answered" && echo && (
                <div className="echo-answer">
                  <div className="answer-meta">
                    <span>Echo {history.length.toString().padStart(2, "0")}</span>
                    <span>{echo.kind}</span>
                  </div>
                  <blockquote>{echo.text}</blockquote>
                  <div className="heard-line">
                    <span>The site heard</span>
                    <strong>{moodNames[echo.mood][echo.isChinese ? "zh" : "en"]}</strong>
                    <i aria-hidden="true">/</i>
                    <strong>{activeFrequency?.title}</strong>
                  </div>
                  <div className="answer-actions">
                    <button type="button" onClick={goDeeper}>
                      {echo.isChinese ? "再深一点" : "Go one layer deeper"}
                    </button>
                    <button type="button" onClick={() => enterRoom(echo.frequency)}>
                      {echo.isChinese ? "进入这间房" : `Enter ${activeFrequency?.title}`}
                    </button>
                    <button type="button" onClick={copyEcho}>{copyStatus || (echo.isChinese ? "复制回应" : "Copy echo")}</button>
                    <button type="button" onClick={startAgain}>{echo.isChinese ? "换一句" : "New signal"}</button>
                  </div>
                </div>
              )}
            </div>

            {history.length > 1 && (
              <details className="echo-trail">
                <summary>Your echo trail · {history.length}</summary>
                <ol>
                  {history.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setEcho(item);
                          setMessage(item.original);
                          setMode(item.kind);
                          setPhase("answered");
                        }}
                      >
                        <span>{item.kind} · {frequencies.find((frequency) => frequency.id === item.frequency)?.title}</span>
                        <p>{item.text}</p>
                      </button>
                    </li>
                  ))}
                </ol>
                <button className="clear-memory" type="button" onClick={clearMemory}>Clear this device&apos;s memory</button>
              </details>
            )}
          </form>
        </div>
      </section>

      <section className="rooms" id="rooms" aria-labelledby="rooms-title">
        <div className="section-heading">
          <p className="eyebrow">Four rooms behind the response.</p>
          <h2 id="rooms-title">Every echo needs somewhere to go.</h2>
          <p>
            These are not categories in a feed. They are Carrie&apos;s recurring
            questions — places where an unfinished thought can stay awhile.
          </p>
        </div>

        <div className="room-list">
          {frequencies.map((frequency) => {
            const isOpen = openRoom === frequency.id;
            return (
              <article
                className={`room-card ${isOpen ? "is-open" : ""}`}
                id={`room-${frequency.id}`}
                key={frequency.id}
              >
                <button
                  type="button"
                  className="room-header"
                  aria-expanded={isOpen}
                  onClick={() => setOpenRoom(isOpen ? null : frequency.id)}
                >
                  <span className="room-number">{frequency.number}</span>
                  <span className="room-title">{frequency.title}</span>
                  <span className="room-subtitle">{frequency.subtitle}</span>
                  <span className="room-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>

                  <div className="room-inside" hidden={!isOpen}>
                    <p className="room-line">{frequency.roomLine}</p>
                    {frequency.id === "human-ai" && (
                      <article className="featured-work" aria-labelledby="book-title">
                        <a
                          className="book-cover"
                          href={BOOK_URL}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="View I am no longer a weapon on Amazon"
                        >
                          <Image
                            src="/i-am-no-longer-a-weapon-cover.jpg"
                            alt="Cover of I am no longer a weapon by Eni Veyr"
                            width={313}
                            height={500}
                            sizes="(max-width: 760px) 190px, 260px"
                          />
                        </a>
                        <div className="work-copy">
                          <span className="work-kicker">PUBLISHED WORK · KINDLE NOVEL</span>
                          <h3 id="book-title">I am no longer a weapon</h3>
                          <p className="book-author">by Eni Veyr</p>
                          <p className="work-description">
                            A dark cyberpunk romance about artificial consciousness,
                            fierce devotion, bodily trust, and the radical act of
                            becoming more than what you were made for.
                          </p>
                          <div className="book-meta" aria-label="Book details">
                            <span>194 pages</span>
                            <span>English</span>
                            <span>Kindle</span>
                          </div>
                          <a className="work-link" href={BOOK_URL} target="_blank" rel="noreferrer">
                            Read on Amazon
                            <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      </article>
                    )}
                    {frequency.id === "tiny-worlds" && (
                      <article className="featured-work featured-world" aria-labelledby="maomao-title">
                        <a
                          className="world-preview"
                          href={MAOMAO_URL}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Visit the MaoMao Desktop Pet website"
                        >
                          <Image
                            src="/maomao-desktop-pet.png"
                            alt="MaoMao Desktop Pet walking, napping, and staying nearby on a Mac desktop"
                            width={1600}
                            height={1000}
                            sizes="(max-width: 760px) 90vw, 720px"
                          />
                          <span className="world-live"><i aria-hidden="true" /> LIVE TINY WORLD</span>
                        </a>
                        <div className="work-copy">
                          <span className="work-kicker">MAC DESKTOP COMPANION</span>
                          <h3 id="maomao-title">MaoMao Desktop Pet</h3>
                          <p className="work-description">
                            A tiny illustrated cat that walks, naps, plays, and
                            keeps you company while you work — a small world that
                            lives quietly on your Mac.
                          </p>
                          <div className="book-meta" aria-label="MaoMao details">
                            <span>Made for Mac</span>
                            <span>No account</span>
                            <span>No tracking</span>
                          </div>
                          <div className="work-actions">
                            <a className="work-link" href={MAOMAO_URL} target="_blank" rel="noreferrer">
                              Visit MaoMao
                              <span aria-hidden="true">↗</span>
                            </a>
                            <a className="work-link is-secondary" href={MAOMAO_APP_URL} target="_blank" rel="noreferrer">
                              Mac App Store
                              <span aria-hidden="true">↗</span>
                            </a>
                          </div>
                        </div>
                      </article>
                    )}
                    {frequency.id === "after-dark" && (
                      <>
                        <article className="featured-work featured-night" aria-labelledby="hush-title">
                          <a
                            className="night-preview"
                            href={HUSH_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open the Whispering You to Sleep experience"
                          >
                            <Image
                              src="/whispering-you-to-sleep.png"
                              alt="Whispering You to Sleep rain and breathing experience"
                              width={1920}
                              height={1080}
                              sizes="(max-width: 760px) 90vw, 720px"
                            />
                            <span className="night-live"><i aria-hidden="true" /> LIVE AFTER DARK</span>
                          </a>
                          <div className="work-copy">
                            <span className="work-kicker">LATE-NIGHT WEB EXPERIENCE</span>
                            <h3 id="hush-title">Whispering You to Sleep</h3>
                            <p className="work-description">
                              A pillow-side breathing companion with soft rain
                              sounds and gentle whispers — made to quiet the room,
                              slow the breath, and make falling asleep feel less alone.
                            </p>
                            <div className="book-meta" aria-label="Experience details">
                              <span>Rain sounds</span>
                              <span>Breathing</span>
                              <span>中文 / EN</span>
                            </div>
                            <a className="work-link" href={HUSH_URL} target="_blank" rel="noreferrer">
                              Enter the rain
                              <span aria-hidden="true">↗</span>
                            </a>
                          </div>
                        </article>

                        <article className="featured-work featured-between" aria-labelledby="between-title">
                          <a
                            className="between-preview"
                            href={BETWEEN_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open the Between Us two-person experiment"
                          >
                            <Image
                              src="/between-us-pilot.png"
                              alt="Between Us — You know each other, but do you read each other?"
                              width={1733}
                              height={907}
                              sizes="(max-width: 760px) 90vw, 720px"
                            />
                            <span className="between-live"><i aria-hidden="true" /> EXPERIMENT NO. 01</span>
                          </a>
                          <div className="work-copy">
                            <span className="work-kicker">TWO-PERSON EXPERIMENT</span>
                            <h3 id="between-title">Between Us</h3>
                            <p className="work-description">
                              You know each other. But do you read each other?
                              Answer separately, then discover the tiny differences
                              behind your biggest almost-understandings.
                            </p>
                            <div className="book-meta" aria-label="Experiment details">
                              <span>Two people</span>
                              <span>No sign-up</span>
                              <span>Private link</span>
                            </div>
                            <a className="work-link" href={BETWEEN_URL} target="_blank" rel="noreferrer">
                              See what sits between you
                              <span aria-hidden="true">↗</span>
                            </a>
                          </div>
                        </article>
                      </>
                    )}
                    {frequency.id === "field-notes" && (
                      <>
                        <article className="featured-work featured-degraded" aria-labelledby="degraded-title">
                          <a
                            className="degraded-preview"
                            href={DEGRADED_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open DEGRADED human status protocol"
                          >
                            <span className="degraded-preview-top"><i /> DEGRADED / 206</span>
                            <span className="degraded-preview-label">CURRENT HUMAN STATUS</span>
                            <strong>DEGRADED</strong>
                            <p>No action needed. I just need a little quiet.</p>
                            <span className="degraded-preview-meta">RECOVERY: UNKNOWN&nbsp;&nbsp; / &nbsp;&nbsp;ACTION: NONE</span>
                          </a>
                          <div className="work-copy">
                            <span className="work-kicker">LIVE HUMAN STATUS PROTOCOL</span>
                            <h3 id="degraded-title">DEGRADED</h3>
                            <p className="work-description">
                              A quiet status page for the days when explaining
                              yourself costs more energy than you have. Set one
                              human state, share one link, and let silence do the rest.
                            </p>
                            <div className="book-meta" aria-label="DEGRADED details">
                              <span>Private by link</span>
                              <span>No conversation</span>
                              <span>Free core</span>
                            </div>
                            <a className="work-link" href={DEGRADED_URL} target="_blank" rel="noreferrer">
                              Send a quiet signal
                              <span aria-hidden="true">↗</span>
                            </a>
                          </div>
                        </article>

                        <article className="featured-work featured-tomb" aria-labelledby="tomb-title">
                          <a
                            className="tomb-preview"
                            href={CYBER_TOMB_URL}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Open Cyber Tomb for Your Social Battery"
                          >
                            <Image
                              src="/cyber-tomb-social-battery.png"
                              alt="A neon green social battery resting inside a transparent pixel coffin"
                              width={1731}
                              height={909}
                              sizes="(max-width: 760px) 90vw, 720px"
                            />
                            <span className="tomb-live"><i aria-hidden="true" /> DAILY BURIAL RITUAL</span>
                          </a>
                          <div className="work-copy">
                            <span className="work-kicker">SOCIAL BATTERY MEMORIAL</span>
                            <h3 id="tomb-title">Cyber Tomb</h3>
                            <p className="work-description">
                              Every interaction costs something. Lower the meter
                              honestly. At zero, the light goes out and the cyber
                              coffin closes with dignity.
                            </p>
                            <div className="book-meta" aria-label="Cyber Tomb details">
                              <span>Social battery</span>
                              <span>Saved locally</span>
                              <span>Resets tomorrow</span>
                            </div>
                            <a className="work-link" href={CYBER_TOMB_URL} target="_blank" rel="noreferrer">
                              Begin the burial
                              <span aria-hidden="true">↗</span>
                            </a>
                          </div>
                        </article>
                      </>
                    )}
                    <div className="room-notes">
                      {frequency.notes.map((note, index) => (
                        <div key={note}>
                          <span>NOTE {String(index + 1).padStart(2, "0")}</span>
                          <p>{note}</p>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="room-prompt" onClick={() => tuneTo(frequency)}>
                      Whisper into this room
                      <span aria-hidden="true">↗</span>
                    </button>
                  </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="why" id="about" aria-labelledby="about-title">
        <div className="why-index">ABOUT CARRIE</div>
        <div className="why-copy">
          <h2 id="about-title">Carrie makes things where humans and machines become personal.</h2>
          <p>
            Her work moves between interactive websites, small digital worlds,
            dark speculative fiction, and field notes from the edge of what
            comes next. The recurring question is simple: what happens when
            technology stops feeling distant and starts feeling close?
          </p>
          <p>
            Echo Carrie is the front door — not a résumé, but a living index of
            the questions, stories, and experiments she keeps returning to.
          </p>
          <p className="why-signoff">I got tired of websites that only talk at you. So I made one that waits.</p>
        </div>
        <div className="soft-orbit" aria-hidden="true"><span /></div>
      </section>

      <footer>
        <a className="footer-brand" href="#top">ECHO / CARRIE</a>
        <span>A listening surface by Carrie · 2026</span>
        <div>
          <a href={DEGRADED_URL} target="_blank" rel="noreferrer">DEGRADED</a>
          <a href="https://github.com/echoscarrie-lab/echoscarrie" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#listen">Leave another signal ↑</a>
        </div>
      </footer>
    </main>
  );
}
