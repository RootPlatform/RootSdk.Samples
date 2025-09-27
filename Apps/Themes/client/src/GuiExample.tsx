import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import "./App.css";

/* ================= Allowed tokens ================= */
const ROOT_TOKENS: string[] = [
  "--rootsdk-brand-primary",
  "--rootsdk-brand-secondary",
  "--rootsdk-brand-tertiary",

  "--rootsdk-text-primary",
  "--rootsdk-text-secondary",
  "--rootsdk-text-tertiary",
  "--rootsdk-text-white",

  "--rootsdk-background-primary",
  "--rootsdk-background-secondary",
  "--rootsdk-background-tertiary",

  "--rootsdk-input",
  "--rootsdk-border",

  "--rootsdk-highlight-light",
  "--rootsdk-highlight-normal",
  "--rootsdk-highlight-strong",

  "--rootsdk-info",
  "--rootsdk-warning",
  "--rootsdk-error",

  "--rootsdk-muted",
  "--rootsdk-link",
];

/* Property-aware tie-break priorities when multiple tokens resolve to same color */
const PRIORITY: Record<"text" | "bg" | "border", string[]> = {
  text: [
    "--rootsdk-text-primary",
    "--rootsdk-text-secondary",
    "--rootsdk-text-tertiary",
    "--rootsdk-link",
    "--rootsdk-text-white",
    "--rootsdk-brand-primary",
    "--rootsdk-brand-secondary",
    "--rootsdk-brand-tertiary",
  ],
  bg: [
    "--rootsdk-background-primary",
    "--rootsdk-background-secondary",
    "--rootsdk-background-tertiary",
    "--rootsdk-input",
    "--rootsdk-muted",
    "--rootsdk-highlight-strong",
    "--rootsdk-highlight-normal",
    "--rootsdk-highlight-light",
    "--rootsdk-brand-primary",
    "--rootsdk-brand-secondary",
    "--rootsdk-brand-tertiary",
    "--rootsdk-info",
    "--rootsdk-warning",
    "--rootsdk-error",
  ],
  border: [
    "--rootsdk-border",
    "--rootsdk-brand-primary",
    "--rootsdk-brand-secondary",
    "--rootsdk-brand-tertiary",
    "--rootsdk-background-secondary",
    "--rootsdk-background-tertiary",
  ],
};

/* Tip targets (delegated) */
const TIP_TARGET_SELECTOR = [
  ".mock-header",
  ".mock-brand",
  ".mock-nav-link",
  ".mock-tabs",
  ".mock-tab",
  ".mock-card",
  ".mock-card-head",
  ".mock-label",
  ".mock-input",
  ".mock-select",
  ".mock-badge",
  ".mock-switch",
  ".mock-alert",
  ".mock-btn",
].join(",");

/* ================= Tooltip plumbing ================= */
type TipState =
  | {
      text: string;
      target: HTMLElement | null;
    }
  | null;

const TooltipLayer: React.FC<{ tip: TipState }> = ({ tip }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    left: number;
    top: number;
    side: "top" | "bottom";
    arrowLeft: number;
  }>({ left: 0, top: 0, side: "bottom", arrowLeft: 0 });

  useLayoutEffect(() => {
    if (!tip?.target) return;

    const rect = tip.target.getBoundingClientRect();
    const spacing = 10;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let side: "top" | "bottom" = "bottom";
    let left = rect.left + rect.width / 2;
    let top = rect.bottom + spacing;

    requestAnimationFrame(() => {
      const el = bubbleRef.current;
      if (!el) return;
      const b = el.getBoundingClientRect();
      const half = b.width / 2;

      if (top + b.height > viewportH - 8) {
        side = "top";
        top = rect.top - spacing - b.height;
      }

      const minLeft = 8 + half;
      const maxLeft = viewportW - 8 - half;
      const clampedLeft = Math.max(minLeft, Math.min(maxLeft, left));

      const arrowLeft = Math.max(
        12,
        Math.min(b.width - 12, half + (left - clampedLeft))
      );

      setPos({
        left: clampedLeft,
        top: Math.max(8, Math.min(viewportH - 8 - b.height, top)),
        side,
        arrowLeft,
      });
    });
  }, [tip?.target, tip?.text]);

  if (!tip?.target || !tip.text) return null;

  return ReactDOM.createPortal(
    <div className="tooltip-layer" aria-hidden>
      <div
        ref={bubbleRef}
        className="tooltip-bubble"
        style={{ left: pos.left, top: pos.top }}
        role="tooltip"
      >
        {tip.text}
        <div
          className={`tooltip-arrow ${pos.side === "bottom" ? "bottom" : "top"}`}
          style={{ ["--arrow-left" as any]: `${pos.arrowLeft}px` }}
        />
      </div>
    </div>,
    document.body
  );
};

/* ================= Color & style helpers ================= */

/** Normalize any CSS color string into canonical computed rgb/rgba string */
function normalizeColor(input: string): string {
  const span = document.createElement("span");
  document.body.appendChild(span);
  span.style.color = input.trim();
  const out = getComputedStyle(span).color.replace(/\s+/g, "");
  span.remove();
  return out;
}

/** Build a resolver mapping rgb/rgba -> tokens */
function buildTokenResolver(): (color: string, kind: "text" | "bg" | "border") => string | null {
  const probe = document.createElement("span");
  document.body.appendChild(probe);

  const map = new Map<string, string[]>();
  for (const token of ROOT_TOKENS) {
    probe.style.color = `var(${token})`;
    const rgb = getComputedStyle(probe).color.replace(/\s+/g, "");
    const arr = map.get(rgb);
    if (arr) {
      if (!arr.includes(token)) arr.push(token);
    } else {
      map.set(rgb, [token]);
    }
  }
  map.set(normalizeColor("transparent"), ["transparent"]);

  probe.remove();

  return (color, kind) => {
    const normalized = normalizeColor(color);
    const candidates = map.get(normalized);
    if (!candidates || candidates.length === 0) return null;

    const pref = PRIORITY[kind] || [];
    for (const p of pref) if (candidates.includes(p)) return p;

    return candidates[0] ?? null;
  };
}

type StyleSnapshot = {
  text?: string | null;
  bg?: string | null;
  border?: string | null;
  opacity?: string | null;
};

function snapshot(el: Element): StyleSnapshot {
  const cs = getComputedStyle(el as HTMLElement);
  return {
    text: cs.color,
    bg: cs.backgroundColor,
    border: cs.borderTopColor,
    opacity: cs.opacity,
  };
}

// Capture "off" (non-hover) snapshot by cloning offscreen
function snapshotOff(el: HTMLElement): StyleSnapshot {
  const clone = el.cloneNode(true) as HTMLElement;
  const holder = document.createElement("div");
  holder.style.position = "fixed";
  holder.style.top = "-10000px";
  holder.style.left = "-10000px";
  holder.style.pointerEvents = "none";
  holder.style.opacity = "0";
  holder.appendChild(clone);
  document.body.appendChild(holder);

  const snap = snapshot(clone);
  holder.remove();
  return snap;
}

function formatLines(
  snap: StyleSnapshot,
  resolveToken: (v: string, kind: "text" | "bg" | "border") => string | null,
  prefix?: string
) {
  const lines: string[] = [];
  const p = prefix ? `${prefix} ` : "";

  const addColor = (
    label: string,
    val: string | null | undefined,
    kind: "text" | "bg" | "border"
  ) => {
    if (!val) return;
    const token = resolveToken(val, kind);
    const shown = token ? `var(${token})` : normalizeColor(val);
    lines.push(`${p}${label}: ${shown}`);
  };

  const addOpacity = (val: string | null | undefined) => {
    if (val == null) return;
    const num = Number(val);
    const out = Number.isFinite(num) ? num.toFixed(2) : String(val);
    lines.push(`${p}Opacity: ${out}`);
  };

  addColor("Text", snap.text, "text");
  addColor("BG", snap.bg, "bg");
  addColor("Border", snap.border, "border");
  addOpacity(snap.opacity);

  return lines;
}

function isHoverable(el: HTMLElement) {
  return el.matches(".mock-btn, .mock-nav-link, .mock-tab") || el.tagName === "BUTTON";
}

/** Build tooltip; accepts optional pre-recorded active snapshot for this element */
function buildTooltipText(el: HTMLElement, activeSnap?: StyleSnapshot | null): string {
  const resolve = buildTokenResolver();
  const current = snapshot(el);

  if (isHoverable(el)) {
    const off = snapshotOff(el);

    // If we have a recorded Active snapshot, use it; otherwise fall back to current (Hover)
    const active = activeSnap ?? current;

    const offLines = formatLines(off, resolve, "Off");
    const hovLines = formatLines(current, resolve, "Hover");
    const actLines = formatLines(active, resolve, "Active");
    return [...offLines, ...hovLines, ...actLines].join("\n");
  }

  return formatLines(current, resolve).join("\n");
}

/* ================= Component ================= */

const GuiExample: React.FC = () => {
  const [tip, setTip] = useState<TipState>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Cache of last measured "Active" snapshot per element
  const activeMapRef = useRef<WeakMap<HTMLElement, StyleSnapshot>>(new WeakMap());

  // Hide tooltip on scroll/resize to avoid stale positions
  useEffect(() => {
    const hide = () => setTip(null);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, []);

  const showFrom = useCallback((el: HTMLElement | null) => {
    if (!el) return setTip(null);
    const activeSnap = activeMapRef.current.get(el) || null;
    const text = buildTooltipText(el, activeSnap);
    if (!text) return setTip(null);
    setTip({ text, target: el });
  }, []);

  const onMouseOver = useCallback(
    (e: React.MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        TIP_TARGET_SELECTOR
      ) as HTMLElement | null;
      if (el && wrapRef.current?.contains(el)) showFrom(el);
    },
    [showFrom]
  );

  const onMouseOut = useCallback((e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    const nextEl = related?.closest?.(TIP_TARGET_SELECTOR) as HTMLElement | null;
    if (!nextEl || !wrapRef.current?.contains(nextEl)) setTip(null);
  }, []);

  const onFocusIn = useCallback(
    (e: React.FocusEvent) => {
      const el = (e.target as HTMLElement).closest(
        TIP_TARGET_SELECTOR
      ) as HTMLElement | null;
      if (el && wrapRef.current?.contains(el)) showFrom(el);
    },
    [showFrom]
  );

  const onFocusOut = useCallback((e: React.FocusEvent) => {
    const next = e.relatedTarget as HTMLElement | null;
    const nextEl = next?.closest?.(TIP_TARGET_SELECTOR) as HTMLElement | null;
    if (!nextEl || !wrapRef.current?.contains(nextEl)) setTip(null);
  }, []);

  // --- NEW: record actual :active snapshot during pointer/key press ---
  const recordActiveSnapshot = useCallback((el: HTMLElement) => {
    if (!isHoverable(el)) return;
    // Wait a frame so :active styles apply
    requestAnimationFrame(() => {
      const snap = snapshot(el);
      activeMapRef.current.set(el, snap);
      // If tooltip is currently for this element, refresh it to include Active block
      setTip((prev) =>
        prev && prev.target === el
          ? { text: buildTooltipText(el, snap), target: el }
          : prev
      );
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = (e.target as HTMLElement).closest(
      TIP_TARGET_SELECTOR
    ) as HTMLElement | null;
    if (!el || !wrapRef.current?.contains(el)) return;
    recordActiveSnapshot(el);
  }, [recordActiveSnapshot]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (!wrapRef.current?.contains(target)) return;
    if (e.key !== " " && e.key !== "Enter") return;
    const el = target.closest(TIP_TARGET_SELECTOR) as HTMLElement | null;
    if (!el) return;
    recordActiveSnapshot(el);
  }, [recordActiveSnapshot]);

  return (
    <>
      <div
        className="mock-wrap"
        ref={wrapRef}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onFocus={onFocusIn}
        onBlur={onFocusOut}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        {/* Header / Navbar */}
        <header className="mock-header" tabIndex={0}>
          <div className="mock-brand" tabIndex={0}>
            Root App
          </div>
          <nav className="mock-nav">
            <a className="mock-nav-link active" href="#dash">
              Dashboard
            </a>
            <a className="mock-nav-link" href="#reports">
              Reports
            </a>
            <a className="mock-nav-link" href="#settings">
              Settings
            </a>
          </nav>
        </header>

        {/* Tabs */}
        <div className="mock-tabs" tabIndex={0}>
          <button className="mock-tab active" type="button">
            Overview
          </button>
          <button className="mock-tab" type="button">
            Details
          </button>
          <button className="mock-tab" type="button">
            Activity
          </button>
        </div>

        {/* Content grid */}
        <div className="mock-grid">
          {/* Card w/ form controls */}
          <div className="mock-card" tabIndex={0}>
            <div className="mock-card-head" tabIndex={0}>
              <h4>Profile</h4>
              <span className="mock-badge info" tabIndex={0}>
                New
              </span>
            </div>
            <div className="mock-card-body">
              <label className="mock-label" htmlFor="name" tabIndex={0}>
                Name
              </label>
              <input id="name" className="mock-input" placeholder="Jane Doe" />

              <label className="mock-label" htmlFor="role" tabIndex={0}>
                Role
              </label>
              <select id="role" className="mock-select">
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>

              <div className="mock-row">
                <button className="mock-btn primary" type="button">
                  Save changes
                </button>
                <button className="mock-btn secondary" type="button">
                  Cancel
                </button>
                <button className="mock-btn linkish" type="button">
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* Card w/ switches & alert */}
          <div className="mock-card" tabIndex={0}>
            <div className="mock-card-head" tabIndex={0}>
              <h4>Preferences</h4>
              <span className="mock-badge warning" tabIndex={0}>
                Beta
              </span>
            </div>
            <div className="mock-card-body">
              <div className="mock-switch-row">
                <div className="mock-switch" tabIndex={0} aria-hidden />
                <div>
                  <div className="mock-label" tabIndex={0}>
                    Email notifications
                  </div>
                  <div className="mock-subtle">Receive updates and digests</div>
                </div>
              </div>

              <div className="mock-switch-row">
                <div className="mock-switch off" tabIndex={0} aria-hidden />
                <div>
                  <div className="mock-label" tabIndex={0}>
                    Desktop alerts
                  </div>
                  <div className="mock-subtle">Show system notifications</div>
                </div>
              </div>

              <div className="mock-alert error" tabIndex={0}>
                <strong>Heads up:</strong> You have unsaved changes.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single global tooltip */}
      <TooltipLayer tip={tip} />
    </>
  );
};

export default GuiExample;
