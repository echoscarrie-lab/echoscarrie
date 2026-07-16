"use client";

const ENDPOINT = "https://degraded.echoscarrie.com/api/analytics";
const SESSION_KEY = "echo_analytics_session_v1";
const ATTRIBUTION_KEY = "echo_analytics_attribution_v1";

type EchoAnalyticsEvent = "page_view" | "outbound_click" | "echo_created";

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

function sessionId() {
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const created = randomId();
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return randomId();
  }
}

function attribution() {
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (stored) return JSON.parse(stored) as Record<string, string>;
  } catch {
    // Build a fresh anonymous attribution record below.
  }

  const params = new URLSearchParams(window.location.search);
  let referrerHost = "";
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    // Invalid referrers are ignored.
  }
  const created = {
    referrerHost,
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
  };
  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(created));
  } catch {
    // Analytics remains best-effort when storage is unavailable.
  }
  return created;
}

export function trackAnalytics(
  eventName: EchoAnalyticsEvent,
  target?: { host?: string; path?: string },
) {
  if (typeof window === "undefined") return;
  void fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({
      sessionId: sessionId(),
      site: "echo",
      eventName,
      path: window.location.pathname,
      ...attribution(),
      targetHost: target?.host ?? "",
      targetPath: target?.path ?? "",
    }),
    credentials: "omit",
    keepalive: true,
    mode: "cors",
  }).catch(() => undefined);
}
