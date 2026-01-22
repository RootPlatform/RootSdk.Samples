import React, { useEffect, useState } from 'react';
import {
  rootClient,
  RootThemeMode,
  RootClientThemeEvent,
} from '@rootsdk/client-app';
import { CodeBlock } from '../components';
import './ThemeApiTab.css';

const THEME_API_CODE = `import { rootClient, RootThemeMode, RootClientThemeEvent } from '@rootsdk/client-app';

// Get the current theme
const currentTheme: RootThemeMode = rootClient.theme.getTheme();
// Returns: 'light' | 'dark'

// Subscribe to theme change events
function onThemeUpdate(newMode: RootThemeMode): void {
  console.log('Theme changed to:', newMode);
  // Update your app's state/UI here
}

// Add the listener
rootClient.theme.on(RootClientThemeEvent.ThemeUpdate, onThemeUpdate);

// Don't forget to clean up when component unmounts
rootClient.theme.off(RootClientThemeEvent.ThemeUpdate, onThemeUpdate);`;

const REACT_HOOK_CODE = `// React Hook Pattern
import { useEffect, useState } from 'react';
import { rootClient, RootThemeMode, RootClientThemeEvent } from '@rootsdk/client-app';

function useRootTheme() {
  const [theme, setTheme] = useState<RootThemeMode>(() =>
    rootClient.theme.getTheme()
  );

  useEffect(() => {
    const handleThemeChange = (newMode: RootThemeMode) => {
      setTheme(newMode);
    };

    rootClient.theme.on(RootClientThemeEvent.ThemeUpdate, handleThemeChange);

    return () => {
      rootClient.theme.off(RootClientThemeEvent.ThemeUpdate, handleThemeChange);
    };
  }, []);

  return theme;
}

// Usage in a component
function MyComponent() {
  const theme = useRootTheme();
  return <div>Current theme: {theme}</div>;
}`;

export const ThemeApiTab: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<RootThemeMode | 'loading'>('loading');
  const [eventTheme, setEventTheme] = useState<RootThemeMode | 'waiting'>('waiting');
  const [eventCount, setEventCount] = useState(0);

  // Get initial theme
  useEffect(() => {
    const theme = rootClient.theme.getTheme();
    setCurrentTheme(theme);
  }, []);

  // Subscribe to theme events
  useEffect(() => {
    const handleThemeUpdate = (newMode: RootThemeMode) => {
      setEventTheme(newMode);
      setCurrentTheme(newMode);
      setEventCount(c => c + 1);
    };

    rootClient.theme.on(RootClientThemeEvent.ThemeUpdate, handleThemeUpdate);

    return () => {
      rootClient.theme.off(RootClientThemeEvent.ThemeUpdate, handleThemeUpdate);
    };
  }, []);

  const handleGetTheme = () => {
    const theme = rootClient.theme.getTheme();
    setCurrentTheme(theme);
  };

  return (
    <div className="theme-api-tab">
      <section className="api-section">
        <h3>Live Theme Status</h3>
        <div className="theme-status-grid">
          <div className="status-card">
            <div className="status-label">Current Theme</div>
            <div className={`status-value theme-${currentTheme}`}>
              {currentTheme}
            </div>
            <button className="button-outline" onClick={handleGetTheme}>
              Refresh via getTheme()
            </button>
          </div>

          <div className="status-card">
            <div className="status-label">Last Event Value</div>
            <div className={`status-value theme-${eventTheme}`}>
              {eventTheme}
            </div>
            <div className="status-hint">
              Events received: {eventCount}
            </div>
          </div>
        </div>

        <div className="theme-indicator">
          <div className="indicator-preview" />
          <span>
            This box uses <code>var(--rootsdk-text-primary)</code>, it changes color when the theme changes.
          </span>
        </div>
      </section>

      <section className="api-section">
        <h3>Theme API Reference</h3>
        <div className="api-method">
          <h4><code>rootClient.theme.getTheme()</code></h4>
          <p>Returns the current theme mode as <code>'light'</code> or <code>'dark'</code>.</p>
        </div>

        <div className="api-method">
          <h4><code>rootClient.theme.on(RootClientThemeEvent.ThemeUpdate, handler)</code></h4>
          <p>Subscribe to theme change events. The handler receives the new <code>RootThemeMode</code>.</p>
        </div>

        <div className="api-method">
          <h4><code>rootClient.theme.off(RootClientThemeEvent.ThemeUpdate, handler)</code></h4>
          <p>Unsubscribe from theme change events. Always clean up in React's useEffect return.</p>
        </div>
      </section>

      <section className="api-section">
        <h3>Code Examples</h3>
        <CodeBlock
          code={THEME_API_CODE}
          language="typescript"
          title="Basic Usage"
          collapsible
          defaultExpanded
        />

        <CodeBlock
          code={REACT_HOOK_CODE}
          language="typescript"
          title="React Hook Pattern"
          collapsible
          defaultExpanded={false}
        />
      </section>

      <section className="api-section">
        <h3>Important Notes</h3>
        <ul className="notes-list">
          <li>
            <strong>Read-only API:</strong> Apps can only <em>read</em> the current theme.
            There is no <code>setTheme()</code> method. The theme is controlled by the
            Root hosting environment based on user preferences.
          </li>
          <li>
            <strong>Two modes only:</strong> <code>RootThemeMode</code> is either{' '}
            <code>'light'</code> or <code>'dark'</code>. There is no system/auto option.
          </li>
          <li>
            <strong>CSS Variables are automatic:</strong> You don't need to manually
            update CSS colors when the theme changes. The Root hosting environment
            updates all <code>--rootsdk-*</code> variables automatically.
          </li>
          <li>
            <strong>Use events for non-CSS updates:</strong> Subscribe to theme events
            only if you need to update things that can't use CSS variables (like canvas
            rendering, chart libraries, or conditional logic).
          </li>
          <li>
            <strong>Always clean up:</strong> Remove event listeners when your component
            unmounts to prevent memory leaks.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ThemeApiTab;
