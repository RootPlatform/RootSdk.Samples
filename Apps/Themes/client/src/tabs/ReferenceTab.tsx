import React, { useState } from 'react';
import { Dropdown, highlightCode } from '../components';
import designTokens from '../generated/design-tokens.json';
import './ReferenceTab.css';

// Full CSS for all components - the "Copy All CSS" feature
const FULL_COMPONENT_CSS = `/* ============================================================
   ROOT DESIGN SYSTEM - COMPLETE CSS REFERENCE
   ============================================================
   Copy this CSS to get all Root styling patterns.
   All colors use CSS variables that adapt to light/dark theme.
   ============================================================ */

/* ----------------------------------------------------------
   BUTTONS
   ---------------------------------------------------------- */
.button-primary {
  background-color: var(--rootsdk-text-primary);
  color: var(--rootsdk-background-tertiary);
  border: none;
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}
.button-primary:hover { opacity: 0.7; }
.button-primary:active { opacity: 0.5; transform: scale(0.98); }
.button-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.button-outline {
  background-color: transparent;
  color: var(--rootsdk-text-primary);
  border: 1px solid var(--rootsdk-text-tertiary);
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}
.button-outline:hover { opacity: 0.7; }

.button-danger {
  background-color: var(--rootsdk-error);
  color: var(--rootsdk-text-white);
  border: none;
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}
.button-danger:hover { opacity: 0.7; }

/* ----------------------------------------------------------
   INPUTS
   ---------------------------------------------------------- */
.input {
  background-color: var(--rootsdk-input);
  border: 1px solid var(--rootsdk-border);
  border-radius: 12px;
  padding: 14px 20px;
  color: var(--rootsdk-text-primary);
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  outline: none;
}
.input::placeholder { color: var(--rootsdk-text-tertiary); }
.input:focus { border-color: var(--rootsdk-brand-primary); }

/* ----------------------------------------------------------
   PANELS & CARDS
   ---------------------------------------------------------- */
.panel {
  background-color: var(--rootsdk-background-secondary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 12px;
  padding: 16px;
}

/* ----------------------------------------------------------
   SWITCH
   ---------------------------------------------------------- */
.switch {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: var(--rootsdk-highlight-normal);
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 150ms;
}
.switch[data-state="checked"] { background-color: var(--rootsdk-brand-primary); }
.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: var(--rootsdk-text-primary);
  border-radius: 50%;
  transition: transform 150ms;
}
.switch[data-state="checked"] .switch-thumb { transform: translateX(20px); }

/* ----------------------------------------------------------
   BADGES
   ---------------------------------------------------------- */
.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid var(--rootsdk-border);
  background: var(--rootsdk-background-tertiary);
  color: var(--rootsdk-text-secondary);
}
.badge-info { background: var(--rootsdk-info); color: #1F2937; border-color: transparent; }
.badge-warning { background: var(--rootsdk-warning); color: #1F2937; border-color: transparent; }
.badge-error { background: var(--rootsdk-error); color: var(--rootsdk-text-white); border-color: transparent; }

/* ----------------------------------------------------------
   ALERTS
   ---------------------------------------------------------- */
.alert {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  border: 1px solid var(--rootsdk-border);
  background: var(--rootsdk-background-secondary);
  color: var(--rootsdk-text-primary);
}
.alert-info { background: var(--rootsdk-info); color: #1F2937; border-color: transparent; }
.alert-warning { background: var(--rootsdk-warning); color: #1F2937; border-color: transparent; }
.alert-error { background: var(--rootsdk-error); color: var(--rootsdk-text-white); border-color: transparent; }

/* ----------------------------------------------------------
   LIST ITEMS
   ---------------------------------------------------------- */
.list-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 150ms;
}
.list-item:hover { background-color: var(--rootsdk-highlight-normal); }
.list-item.selected { background-color: var(--rootsdk-highlight-strong); }

/* ----------------------------------------------------------
   ICON BUTTONS
   ---------------------------------------------------------- */
.icon-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  aspect-ratio: 1;
  cursor: pointer;
  color: var(--rootsdk-text-tertiary);
  background: transparent;
  border: none;
  transition: background-color 150ms, color 150ms;
}
.icon-button:hover {
  background-color: var(--rootsdk-highlight-strong);
  color: var(--rootsdk-text-primary);
}

/* ----------------------------------------------------------
   DROPDOWN
   ---------------------------------------------------------- */
.dropdown {
  position: absolute;
  z-index: 100;
  background-color: var(--rootsdk-background-tertiary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}
.dropdown-option {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 150ms;
}
.dropdown-option:hover { background-color: var(--rootsdk-highlight-normal); }

/* ----------------------------------------------------------
   MODAL (use sparingly - prefer inline-edit pattern)
   ---------------------------------------------------------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  padding: 16px;
}
.modal-content {
  background-color: var(--rootsdk-background-primary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
  max-width: 688px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
}

/* ----------------------------------------------------------
   SLIDER
   ---------------------------------------------------------- */
.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}
.slider-track {
  position: relative;
  flex: 1;
  height: 6px;
  background: var(--rootsdk-highlight-strong);
  border-radius: 9999px;
  cursor: pointer;
}
.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--rootsdk-brand-primary);
  border-radius: 9999px;
}
.slider-thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: var(--rootsdk-text-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.slider-value {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: var(--rootsdk-text-secondary);
}

/* ----------------------------------------------------------
   RADIO BUTTONS
   ---------------------------------------------------------- */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.radio-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--rootsdk-border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;
}
.radio-option:hover { background: var(--rootsdk-highlight-light); }
.radio-option.selected {
  border-color: var(--rootsdk-brand-primary);
  background: var(--rootsdk-highlight-light);
}
.radio-squircle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--rootsdk-text-tertiary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radio-option.selected .radio-squircle { border-color: var(--rootsdk-brand-primary); }
.radio-dot {
  width: 10px;
  height: 10px;
  background: var(--rootsdk-brand-primary);
  border-radius: 3px;
  opacity: 0;
  transform: scale(0);
  transition: opacity 150ms, transform 150ms;
}
.radio-option.selected .radio-dot { opacity: 1; transform: scale(1); }
.radio-label {
  font-size: 14px;
  color: var(--rootsdk-text-primary);
}
`;

// Component generator templates
const COMPONENT_TEMPLATES: Record<string, { name: string; css: string; jsx: string }> = {
  'button-primary': {
    name: 'Primary Button',
    css: `.my-button {
  background-color: var(--rootsdk-text-primary);
  color: var(--rootsdk-background-tertiary);
  border: none;
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}
.my-button:hover { opacity: 0.7; }
.my-button:active { opacity: 0.5; transform: scale(0.98); }
.my-button:disabled { opacity: 0.5; cursor: not-allowed; }`,
    jsx: `<button className="my-button">Click me</button>`
  },
  'button-outline': {
    name: 'Outline Button',
    css: `.my-button-outline {
  background-color: transparent;
  color: var(--rootsdk-text-primary);
  border: 1px solid var(--rootsdk-text-tertiary);
  border-radius: 9999px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 200ms;
}
.my-button-outline:hover { opacity: 0.7; }`,
    jsx: `<button className="my-button-outline">Click me</button>`
  },
  'input': {
    name: 'Text Input',
    css: `.my-input {
  background-color: var(--rootsdk-input);
  border: 1px solid var(--rootsdk-border);
  border-radius: 12px;
  padding: 14px 20px;
  color: var(--rootsdk-text-primary);
  font-size: 14px;
  width: 100%;
  outline: none;
}
.my-input::placeholder { color: var(--rootsdk-text-tertiary); }
.my-input:focus { border-color: var(--rootsdk-brand-primary); }`,
    jsx: `<input className="my-input" placeholder="Enter text..." />`
  },
  'card': {
    name: 'Card/Panel',
    css: `.my-card {
  background-color: var(--rootsdk-background-secondary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 12px;
  padding: 16px;
}
.my-card-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--rootsdk-text-primary);
}
.my-card-content {
  font-size: 14px;
  color: var(--rootsdk-text-secondary);
}`,
    jsx: `<div className="my-card">
  <h3 className="my-card-title">Card Title</h3>
  <p className="my-card-content">Card content goes here.</p>
</div>`
  },
  'badge': {
    name: 'Badge',
    css: `.my-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid var(--rootsdk-border);
  background: var(--rootsdk-background-tertiary);
  color: var(--rootsdk-text-secondary);
}
.my-badge-info { background: var(--rootsdk-info); color: #1F2937; border-color: transparent; }
.my-badge-error { background: var(--rootsdk-error); color: var(--rootsdk-text-white); border-color: transparent; }`,
    jsx: `<span className="my-badge">Default</span>
<span className="my-badge my-badge-info">Info</span>
<span className="my-badge my-badge-error">Error</span>`
  },
  'list-item': {
    name: 'List Item',
    css: `.my-list-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 150ms;
  color: var(--rootsdk-text-primary);
}
.my-list-item:hover { background-color: var(--rootsdk-highlight-normal); }
.my-list-item.selected { background-color: var(--rootsdk-highlight-strong); }`,
    jsx: `<div className="my-list-item">Item 1</div>
<div className="my-list-item selected">Item 2 (selected)</div>
<div className="my-list-item">Item 3</div>`
  },
  'switch': {
    name: 'Toggle Switch',
    css: `.my-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: var(--rootsdk-highlight-normal);
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 150ms;
}
.my-switch.checked { background-color: var(--rootsdk-brand-primary); }
.my-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: var(--rootsdk-text-primary);
  border-radius: 50%;
  transition: transform 150ms;
}
.my-switch.checked .my-switch-thumb { transform: translateX(20px); }`,
    jsx: `<div className="my-switch" onClick={toggle}>
  <div className="my-switch-thumb" />
</div>`
  },
  'slider': {
    name: 'Slider',
    css: `.my-slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}
.my-slider-track {
  position: relative;
  flex: 1;
  height: 6px;
  background: var(--rootsdk-highlight-strong);
  border-radius: 9999px;
  cursor: pointer;
}
.my-slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--rootsdk-brand-primary);
  border-radius: 9999px;
}
.my-slider-thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: var(--rootsdk-text-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.my-slider-value {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: var(--rootsdk-text-secondary);
}`,
    jsx: `<div className="my-slider-container">
  <div className="my-slider-track" onClick={handleClick}>
    <div className="my-slider-fill" style={{ width: \`\${value}%\` }} />
    <div className="my-slider-thumb" style={{ left: \`\${value}%\` }} />
  </div>
  <span className="my-slider-value">{value}%</span>
</div>`
  },
  'radio': {
    name: 'Radio Buttons',
    css: `.my-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.my-radio-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid var(--rootsdk-border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 150ms, background-color 150ms;
}
.my-radio-option:hover { background: var(--rootsdk-highlight-light); }
.my-radio-option.selected {
  border-color: var(--rootsdk-brand-primary);
  background: var(--rootsdk-highlight-light);
}
.my-radio-squircle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--rootsdk-text-tertiary);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-radio-option.selected .my-radio-squircle { border-color: var(--rootsdk-brand-primary); }
.my-radio-dot {
  width: 10px;
  height: 10px;
  background: var(--rootsdk-brand-primary);
  border-radius: 3px;
  opacity: 0;
  transform: scale(0);
  transition: opacity 150ms, transform 150ms;
}
.my-radio-option.selected .my-radio-dot { opacity: 1; transform: scale(1); }
.my-radio-label {
  font-size: 14px;
  color: var(--rootsdk-text-primary);
}`,
    jsx: `<div className="my-radio-group">
  <div className="my-radio-option selected" onClick={() => setSelected('opt1')}>
    <div className="my-radio-squircle"><div className="my-radio-dot" /></div>
    <span className="my-radio-label">Option 1</span>
  </div>
  <div className="my-radio-option" onClick={() => setSelected('opt2')}>
    <div className="my-radio-squircle"><div className="my-radio-dot" /></div>
    <span className="my-radio-label">Option 2</span>
  </div>
</div>`
  },
};

export const ReferenceTab: React.FC = () => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string>('button-primary');
  const [generatedCopied, setGeneratedCopied] = useState<'css' | 'jsx' | null>(null);

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(FULL_COMPONENT_CSS);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyGenerated = async (type: 'css' | 'jsx') => {
    const template = COMPONENT_TEMPLATES[selectedComponent];
    if (!template) return;
    try {
      await navigator.clipboard.writeText(type === 'css' ? template.css : template.jsx);
      setGeneratedCopied(type);
      setTimeout(() => setGeneratedCopied(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentTemplate = COMPONENT_TEMPLATES[selectedComponent];

  return (
    <div className="reference-tab">
      {/* Copy All CSS Section */}
      <section className="reference-section copy-all-section">
        <div className="copy-all-header">
          <div>
            <h3>Complete CSS Reference</h3>
            <p>Copy all Root component styles with one click.</p>
          </div>
          <button
            className={`copy-all-button ${copiedAll ? 'copied' : ''}`}
            onClick={handleCopyAll}
          >
            {copiedAll ? 'Copied!' : 'Copy All CSS'}
          </button>
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="reference-section">
        <h3>Quick Reference</h3>
        <div className="reference-table-wrapper">
          <table className="reference-table">
            <thead>
              <tr>
                <th>Element</th>
                <th>Background</th>
                <th>Border</th>
                <th>Radius</th>
                <th>Padding</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Panel/Card</td>
                <td><code>background-secondary</code></td>
                <td><code>1px border</code></td>
                <td><code>12px</code></td>
                <td><code>16px</code></td>
              </tr>
              <tr>
                <td>Input</td>
                <td><code>input</code></td>
                <td><code>1px border</code></td>
                <td><code>12px</code></td>
                <td><code>14px 20px</code></td>
              </tr>
              <tr>
                <td>Button</td>
                <td><code>text-primary</code></td>
                <td>none</td>
                <td><code>9999px</code></td>
                <td><code>8px 24px</code></td>
              </tr>
              <tr>
                <td>Badge</td>
                <td><code>background-tertiary</code></td>
                <td><code>1px border</code></td>
                <td><code>9999px</code></td>
                <td><code>4px 8px</code></td>
              </tr>
              <tr>
                <td>Alert</td>
                <td><code>background-secondary</code></td>
                <td><code>1px border</code></td>
                <td><code>10px</code></td>
                <td><code>12px 16px</code></td>
              </tr>
              <tr>
                <td>Dropdown</td>
                <td><code>background-tertiary</code></td>
                <td><code>1px border</code></td>
                <td><code>8px</code></td>
                <td><code>8px</code></td>
              </tr>
              <tr>
                <td>List Item</td>
                <td>transparent</td>
                <td>none</td>
                <td><code>8px</code></td>
                <td><code>8px 12px</code></td>
              </tr>
              <tr>
                <td>Modal</td>
                <td><code>background-primary</code></td>
                <td><code>1px border</code></td>
                <td><code>8px</code></td>
                <td><code>20-24px</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Spacing Reference */}
      <section className="reference-section">
        <h3>Spacing Scale</h3>
        <div className="token-grid">
          {designTokens.spacing.filter(s => s.name !== 'none').map(space => (
            <div key={space.name} className="token-card">
              <div className="token-name">{space.name}</div>
              <div className="token-value">{space.value}</div>
              <div className="token-desc">{space.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius Reference */}
      <section className="reference-section">
        <h3>Border Radius</h3>
        <div className="token-grid">
          {designTokens.borderRadius.filter(r => r.name !== 'none').map(radius => (
            <div key={radius.name} className="token-card">
              <div
                className="radius-preview"
                style={{ borderRadius: radius.value }}
              />
              <div className="token-name">{radius.name}</div>
              <div className="token-value">{radius.value}</div>
              <div className="token-desc">{radius.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Reference */}
      <section className="reference-section">
        <h3>Typography</h3>
        <p className="section-guidance">
          <strong>Root convention:</strong> 14px is the base size for body text and buttons.
          Modal/dialog titles use 16-20px. Major headings use 24px.
          Small text (badges, captions) uses 11-12px. Form labels use 13px.
        </p>
        <div className="subsection">
          <h4>Font Sizes</h4>
          <div className="token-grid">
            {designTokens.typography.fontSizes.map(size => (
              <div key={size.name} className="token-card">
                <div
                  className="font-preview"
                  style={{ fontSize: size.value, lineHeight: size.lineHeight }}
                >
                  Aa
                </div>
                <div className="token-name">{size.name}</div>
                <div className="token-value">{size.value} / {size.lineHeight}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="subsection">
          <h4>Font Weights</h4>
          <p className="subsection-guidance">
            Body text uses 400 (normal). Buttons and emphasis use 500 (semibold).
            Modal titles use 450 (medium). Avoid 600+ except for strong emphasis.
          </p>
          <div className="token-grid">
            {designTokens.typography.fontWeights.map(weight => (
              <div key={weight.name} className="token-card">
                <div
                  className="font-preview"
                  style={{ fontWeight: weight.value }}
                >
                  Aa
                </div>
                <div className="token-name">{weight.name}</div>
                <div className="token-value">{weight.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transitions Reference */}
      <section className="reference-section">
        <h3>Transitions</h3>
        <div className="token-grid">
          {designTokens.transitions.map(trans => (
            <div key={trans.name} className="token-card">
              <div className="token-name">{trans.name}</div>
              <div className="token-value">{trans.value}</div>
              <div className="token-desc">{trans.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows Reference */}
      <section className="reference-section">
        <h3>Shadows</h3>
        <p className="section-guidance">
          <strong>Root convention:</strong> Most UI elements use <code>box-shadow: none</code> (buttons, inputs, cards).
          Shadows are <em>only</em> for floating/elevated elements: modals, dropdowns, popovers, context menus.
          For focus states, use <code>box-shadow: 0 0 0 2px var(--rootsdk-brand-primary)</code> instead of outline.
        </p>
        <div className="token-grid">
          {designTokens.shadows.map(shadow => (
            <div key={shadow.name} className="token-card">
              <div
                className="shadow-preview"
                style={{ boxShadow: shadow.value }}
              />
              <div className="token-name">{shadow.name}</div>
              <div className="token-value-small">{shadow.value}</div>
              {shadow.name === 'none' && (
                <div className="token-desc">Default for buttons, inputs, cards</div>
              )}
              {shadow.name === 'sm' && (
                <div className="token-desc">Rarely used</div>
              )}
              {shadow.name === 'md' && (
                <div className="token-desc">Floating toolbars, indicators</div>
              )}
              {shadow.name === 'lg' && (
                <div className="token-desc">Modals, dropdowns, popovers</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Component Generator */}
      <section className="reference-section generator-section">
        <h3>Component Generator</h3>
        <p className="generator-desc">
          Select a component type to generate copy-pastable CSS and JSX code.
        </p>

        <div className="generator-controls">
          <Dropdown
            options={Object.entries(COMPONENT_TEMPLATES).map(([key, template]) => ({
              value: key,
              label: template.name,
            }))}
            value={selectedComponent}
            onChange={setSelectedComponent}
          />
        </div>

        {currentTemplate && (
          <div className="generator-output">
            <div className="generator-code-block">
              <div className="generator-code-header">
                <span>CSS</span>
                <button
                  className={`generator-copy-btn ${generatedCopied === 'css' ? 'copied' : ''}`}
                  onClick={() => handleCopyGenerated('css')}
                >
                  {generatedCopied === 'css' ? 'Copied!' : 'Copy CSS'}
                </button>
              </div>
              <pre className="generator-code">
                <code>{highlightCode(currentTemplate.css, 'css')}</code>
              </pre>
            </div>

            <div className="generator-code-block">
              <div className="generator-code-header">
                <span>JSX</span>
                <button
                  className={`generator-copy-btn ${generatedCopied === 'jsx' ? 'copied' : ''}`}
                  onClick={() => handleCopyGenerated('jsx')}
                >
                  {generatedCopied === 'jsx' ? 'Copied!' : 'Copy JSX'}
                </button>
              </div>
              <pre className="generator-code">
                <code>{highlightCode(currentTemplate.jsx, 'typescript')}</code>
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReferenceTab;
