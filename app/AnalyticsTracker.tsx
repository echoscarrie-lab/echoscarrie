"use client";

import { useEffect } from "react";
import { trackAnalytics } from "../lib/analytics-client";

export function AnalyticsTracker() {
  useEffect(() => {
    trackAnalytics("page_view");

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) {
          trackAnalytics("outbound_click", { host: url.hostname, path: url.pathname });
        }
      } catch {
        // Ignore malformed links.
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
