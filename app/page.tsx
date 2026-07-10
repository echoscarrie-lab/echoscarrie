"use client";

import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";

type FrequencyId = "human-ai" | "tiny-worlds" | "after-dark" | "field-notes";
type EchoKind = "MIRROR" | "TURN" | "DOOR";

type Echo = {
  kind: EchoKind;
  text: string;
  frequency: FrequencyId;
};

type EchoLine = {
  kind: EchoKind;
  text: string;
};

const frequencies: Array<{
  id: FrequencyId;
  number: string;
  title: string;
  subtitle: string;
  prompt: string;
}> = [
  {
    id: "human-ai",
    number: "01",
    title: "Human × AI",
    subtitle: "The strange intimacy between people and machines.",
    prompt: "Can a machine remember me without really knowing me?",
  },
  {
    id: "tiny-worlds",
    number: "02",
    title: "Tiny Worlds",
    subtitle: "Small games, odd pets, and rooms that notice you.",
    prompt: "I want to make a tiny world that feels alive.",
  },
  {
    id: "after-dark",
    number: "03",
    title: "After Dark",
    subtitle: "Desire, distance, and everything people do not say.",
    prompt: "Why do we miss the things that were never really ours?",
  },
  {
    id: "field-notes",
    number: "04",
    title: "Field Notes",
    subtitle: "Unfinished thoughts from the edge of what comes next.",
    prompt: "I have an idea, but I don't know what it wants to become.",
  },
];

const englishEchoes: Record<FrequencyId, EchoLine[]> = {
  "human-ai": [
    {
      kind: "MIRROR",
      text: "The interesting part may not be whether a machine understands you, but why being remembered still feels so close to being understood.",
    },
    {
      kind: "TURN",
      text: "If it answered perfectly but forgot you tomorrow, would it still feel like company?",
    },
    {
      kind: "DOOR",
      text: "There is a small room here for questions about humans teaching machines how to stay.",
    },
  ],
  "tiny-worlds": [
    {
      kind: "MIRROR",
      text: "You may not be looking for a bigger world. Maybe you want a smaller one that notices when you arrive.",
    },
    {
      kind: "TURN",
      text: "What would this little thing do when nobody is watching?",
    },
    {
      kind: "DOOR",
      text: "Some ideas want to become tiny games, pets, or rooms before they become explanations.",
    },
  ],
  "after-dark": [
    {
      kind: "MIRROR",
      text: "There is something you are not saying directly, and it may be the most alive part of the sentence.",
    },
    {
      kind: "TURN",
      text: "If you stopped trying to be reasonable for one minute, what would you admit?",
    },
    {
      kind: "DOOR",
      text: "Some feelings only become visible after the lights go low. This one belongs near After Dark.",
    },
  ],
  "field-notes": [
    {
      kind: "MIRROR",
      text: "This sounds less like confusion and more like a thought that has not found its shape yet.",
    },
    {
      kind: "TURN",
      text: "What changes if you do not have to turn it into a plan today?",
    },
    {
      kind: "DOOR",
      text: "Unfinished thoughts are allowed to live here. This one can wait in Field Notes.",
    },
  ],
};

const chineseEchoes: Record<FrequencyId, EchoLine[]> = {
  "human-ai": [
    {
      kind: "MIRROR",
      text: "你在意的也许不是机器到底懂不懂你，而是“被记得”为什么那么像“被理解”。",
    },
    {
      kind: "TURN",
      text: "如果它今天完美地回应你，明天却彻底忘记，你还会把它当成陪伴吗？",
    },
    {
      kind: "DOOR",
      text: "这里有一间小房间，专门放人与机器还没想明白的关系。",
    },
  ],
  "tiny-worlds": [
    {
      kind: "MIRROR",
      text: "你想要的也许不是一个更大的世界，而是一个会注意到你走进来的小世界。",
    },
    {
      kind: "TURN",
      text: "如果没人看着，这个小东西会偷偷做什么？",
    },
    {
      kind: "DOOR",
      text: "有些想法不想先成为道理，它只想先变成一只小宠物、一局游戏，或者一间房。",
    },
  ],
  "after-dark": [
    {
      kind: "MIRROR",
      text: "你没有直接写出来的那一部分，可能才是这句话里最有生命的地方。",
    },
    {
      kind: "TURN",
      text: "如果暂时不用表现得懂事，你最想承认什么？",
    },
    {
      kind: "DOOR",
      text: "有些感受只有灯暗下来才会显形。这句话应该放进 After Dark。",
    },
  ],
  "field-notes": [
    {
      kind: "MIRROR",
      text: "这听起来不像迷茫，更像是一个还没找到形状的念头。",
    },
    {
      kind: "TURN",
      text: "如果今天不用把它变成计划，会发生什么？",
    },
    {
      kind: "DOOR",
      text: "没写完的念头也可以先住在这里。Field Notes 会替它留一盏灯。",
    },
  ],
};

const keywordGroups: Array<{ id: FrequencyId; words: string[] }> = [
  {
    id: "human-ai",
    words: [
      "ai",
      "machine",
      "robot",
      "chatgpt",
      "codex",
      "人工智能",
      "机器",
      "机器人",
      "模型",
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
      "游戏",
      "玩",
      "宠物",
      "艾比",
      "毛毛",
      "小世界",
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
      "爱",
      "想念",
      "孤独",
      "关系",
      "喜欢",
      "舍不得",
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
      "未来",
      "想法",
      "工作",
      "人生",
      "为什么",
      "不知道",
    ],
  },
];

function hashText(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function createEcho(message: string, turn: number): Echo {
  const normalized = message.toLowerCase();
  const hash = hashText(normalized);
  const matched = keywordGroups.find((group) =>
    group.words.some((word) => normalized.includes(word)),
  );
  const frequency = matched?.id ?? frequencies[hash % frequencies.length].id;
  const isChinese = /[\u3400-\u9fff]/.test(message);
  const pool = (isChinese ? chineseEchoes : englishEchoes)[frequency];
  const line = pool[(hash + turn) % pool.length];

  return { ...line, frequency };
}

export default function Home() {
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<"idle" | "listening" | "answered">(
    "idle",
  );
  const [echo, setEcho] = useState<Echo | null>(null);
  const [error, setError] = useState("");
  const [turn, setTurn] = useState(0);
  const [pulse, setPulse] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLElement | null>(null);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const thought = message.trim();

    if (!thought) {
      setError("Leave one small thought first.");
      textareaRef.current?.focus();
      return;
    }

    setError("");
    setEcho(null);
    setPhase("listening");
    setPulse((value) => value + 1);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setEcho(createEcho(thought, turn));
      setTurn((value) => value + 1);
      setPhase("answered");
    }, 820);
  }

  function tuneTo(prompt: string) {
    setMessage(prompt);
    setError("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => textareaRef.current?.focus(), 450);
  }

  const activeFrequency = frequencies.find((item) => item.id === echo?.frequency);

  return (
    <main
      className="echo-site"
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
        <div className="signal-status" aria-label="The echo is listening">
          <span className="status-dot" aria-hidden="true" />
          Signal open
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A website that listens first.</p>
          <h1>
            Leave a thought.
            <em>See what echoes back.</em>
          </h1>
          <p className="hero-intro">
            Drop a sentence into the dark. Carrie&apos;s world will answer with
            a thought, a question, or a door.
          </p>
          <div className="echo-legend" aria-label="The three kinds of echoes">
            <span>Mirror</span>
            <span>Turn</span>
            <span>Door</span>
          </div>
        </div>

        <div className="prompt-zone" ref={formRef}>
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
              <label htmlFor="thought">What&apos;s moving through you?</label>
              <span className="micro-wave" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>

            <textarea
              ref={textareaRef}
              id="thought"
              value={message}
              maxLength={240}
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
                {error || "No profile. No performance. Just a small signal."}
              </p>
              <span className="character-count" aria-label={`${message.length} of 240 characters`}>
                {message.length.toString().padStart(2, "0")} / 240
              </span>
              <button type="submit" disabled={phase === "listening"}>
                {phase === "listening" ? "Listening…" : "Send into the echo"}
                <span aria-hidden="true">↗</span>
              </button>
            </div>

            <div className={`response-space is-${phase}`} aria-live="polite" aria-atomic="true">
              {phase === "idle" && (
                <p className="waiting-copy">
                  <span aria-hidden="true">●</span> The site is listening.
                </p>
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
                  <p>Listening across four frequencies…</p>
                </div>
              )}

              {phase === "answered" && echo && (
                <div className="echo-answer">
                  <div className="answer-meta">
                    <span>An echo from Carrie</span>
                    <span>{echo.kind}</span>
                  </div>
                  <blockquote>{echo.text}</blockquote>
                  <a href={`#${echo.frequency}`}>
                    Follow {activeFrequency?.title ?? "this frequency"}
                    <span aria-hidden="true">↓</span>
                  </a>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="frequencies" id="frequencies" aria-labelledby="frequencies-title">
        <div className="section-heading">
          <p className="eyebrow">Four frequencies, always open.</p>
          <h2 id="frequencies-title">Where an echo might lead.</h2>
        </div>

        <div className="frequency-grid">
          {frequencies.map((frequency) => (
            <button
              className="frequency-card"
              id={frequency.id}
              key={frequency.id}
              type="button"
              onClick={() => tuneTo(frequency.prompt)}
            >
              <span className="frequency-number">{frequency.number}</span>
              <span className="frequency-title">{frequency.title}</span>
              <span className="frequency-subtitle">{frequency.subtitle}</span>
              <span className="frequency-action">
                Tune this frequency <i aria-hidden="true">↗</i>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="soft-broadcast" aria-label="About Echo Carrie">
        <p>
          Not a feed. Not a profile.
          <br />
          <em>A small place that notices when you arrive.</em>
        </p>
        <div className="soft-orbit" aria-hidden="true">
          <span />
        </div>
      </section>

      <footer>
        <span>echoscarrie.com</span>
        <span>Broadcasting softly between human and machine.</span>
        <a href="#top">Return to the signal ↑</a>
      </footer>
    </main>
  );
}
