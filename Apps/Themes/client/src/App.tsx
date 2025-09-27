import React, { useEffect, useState } from "react";
import {
  rootClient,
  RootThemeMode,
  RootClientThemeEvent,
} from "@rootsdk/client-app";
import "./App.css";
import ColorSwatches from "./ColorSwatches";
import GuiExample from "./GuiExample";

const ROOT_PREDEFINED_COLORS = [
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

type TabKey = "theme" | "colors" | "example";

const App: React.FC = () => {
  const [theme, setTheme] = useState<RootThemeMode | "unset">("unset");
  const [themeEventResult, setThemeEventResult] = useState<RootThemeMode | "unset">("unset");
  const [active, setActive] = useState<TabKey>("theme");

  // --- Theme state & events ---
  const getTheme = () => {
    const current: RootThemeMode = rootClient.theme.getTheme();
    setTheme(current);
  };

  function onThemeUpdate(newMode: RootThemeMode): void {
    setThemeEventResult(newMode);
  }

  useEffect(() => {
    // subscribe to theme updates
    rootClient.theme.on(RootClientThemeEvent.ThemeUpdate, onThemeUpdate);
    return () => {
      rootClient.theme.off(RootClientThemeEvent.ThemeUpdate, onThemeUpdate);
    };
  }, []);

  // --- A11y-friendly tab button ---
  const TabButton: React.FC<{
    tab: TabKey;
    label: string;
  }> = ({ tab, label }) => (
    <button
      role="tab"
      aria-selected={active === tab}
      aria-controls={`panel-${tab}`}
      id={`tab-${tab}`}
      className={`tab ${active === tab ? "active" : ""}`}
      onClick={() => setActive(tab)}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="app-container">
      {/* Tabs header */}
      <div className="tabs" role="tablist" aria-label="Root SDK demo sections">
        <TabButton tab="theme" label="Theme & Event" />
        <TabButton tab="colors" label="Root SDK Colors" />
        <TabButton tab="example" label="Example UI" />
      </div>

      {/* Panels */}
      {active === "theme" && (
        <section
          id="panel-theme"
          role="tabpanel"
          aria-labelledby="tab-theme"
          className="section-card theme-panel"
        >
          <h2 className="section-title">Theme & Event</h2>
          <p className="theme-text">
            Current theme based on event: <strong>{themeEventResult}</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p className="theme-text">
              Current theme based on button click: <strong>{theme}</strong>
            </p>
            <button className="theme-button root-colored-btn" onClick={getTheme}>Get current theme</button>
          </div>
        </section>
      )}

      {active === "colors" && (
        <section
          id="panel-colors"
          role="tabpanel"
          aria-labelledby="tab-colors"
          className="section-card colors-panel"
        >
          <h2 className="section-title">Root SDK Colors</h2>
          <ColorSwatches vars={ROOT_PREDEFINED_COLORS} />
        </section>
      )}

      {active === "example" && (
        <section
          id="panel-example"
          role="tabpanel"
          aria-labelledby="tab-example"
          className="section-card"
        >
          <h2 className="section-title">Example UI (non-functional)</h2>
          <GuiExample />
        </section>
      )}
    </div>
  );
};

export default App;
