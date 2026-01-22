import React, { useState } from 'react';
import { CodeBlock, Dropdown } from '../components';
import './ComponentsTab.css';

// CSS code snippets for each component
const BUTTON_CSS = `.button-primary {
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
.button-danger:hover { opacity: 0.7; }`;

const INPUT_CSS = `.input {
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
.input::placeholder {
  color: var(--rootsdk-text-tertiary);
}
.input:focus {
  border-color: var(--rootsdk-brand-primary);
}

/* Custom Dropdown (use instead of native select) */
.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--rootsdk-input);
  border: 1px solid var(--rootsdk-border);
  border-radius: 12px;
  padding: 14px 20px;
  font-size: 14px;
  color: var(--rootsdk-text-primary);
  cursor: pointer;
}
.dropdown-trigger:focus {
  border-color: var(--rootsdk-brand-primary);
}
.dropdown-menu {
  background-color: var(--rootsdk-background-tertiary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}
.dropdown-option {
  padding: 10px 16px;
  border-radius: 6px;
  color: var(--rootsdk-text-primary);
  cursor: pointer;
}
.dropdown-option:hover {
  background-color: var(--rootsdk-highlight-normal);
}`;

const PANEL_CSS = `.panel {
  background-color: var(--rootsdk-background-secondary);
  border: 1px solid var(--rootsdk-border);
  border-radius: 12px;
  padding: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--rootsdk-border);
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--rootsdk-text-primary);
  margin: 0;
}`;

const SWITCH_CSS = `.switch {
  position: relative;
  width: 44px;
  height: 24px;
  background-color: var(--rootsdk-highlight-normal);
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 150ms;
}
.switch[data-checked="true"] {
  background-color: var(--rootsdk-brand-primary);
}
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
.switch[data-checked="true"] .switch-thumb {
  transform: translateX(20px);
}`;

const BADGE_CSS = `.badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid var(--rootsdk-border);
  background: var(--rootsdk-background-tertiary);
  color: var(--rootsdk-text-secondary);
}
.badge-info {
  background: var(--rootsdk-info);
  color: #1F2937; /* Dark text for readability */
  border-color: transparent;
}
.badge-warning {
  background: var(--rootsdk-warning);
  color: #1F2937; /* Dark text for readability */
  border-color: transparent;
}
.badge-error {
  background: var(--rootsdk-error);
  color: var(--rootsdk-text-white);
  border-color: transparent;
}`;

const ALERT_CSS = `.alert {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  border: 1px solid var(--rootsdk-border);
  background: var(--rootsdk-background-secondary);
  color: var(--rootsdk-text-primary);
}
.alert-info {
  background: var(--rootsdk-info);
  color: #1F2937; /* Dark text for readability */
  border-color: transparent;
}
.alert-warning {
  background: var(--rootsdk-warning);
  color: #1F2937; /* Dark text for readability */
  border-color: transparent;
}
.alert-error {
  background: var(--rootsdk-error);
  color: var(--rootsdk-text-white);
  border-color: transparent;
}`;

const LIST_ITEM_CSS = `.list-item {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 150ms;
  color: var(--rootsdk-text-primary);
}
.list-item:hover {
  background-color: var(--rootsdk-highlight-normal);
}
.list-item.selected {
  background-color: var(--rootsdk-highlight-strong);
}`;

const ICON_BUTTON_CSS = `.icon-button {
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
}`;

const SLIDER_CSS = `.slider-container {
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
  cursor: grab;
  transition: transform 150ms;
}
.slider-thumb:hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.slider-value {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  color: var(--rootsdk-text-secondary);
}`;

const RADIO_CSS = `.radio-group {
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
.radio-option:hover {
  background: var(--rootsdk-highlight-light);
}
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
  transition: border-color 150ms;
}
.radio-option.selected .radio-squircle {
  border-color: var(--rootsdk-brand-primary);
}
.radio-dot {
  width: 10px;
  height: 10px;
  background: var(--rootsdk-brand-primary);
  border-radius: 3px;
  opacity: 0;
  transform: scale(0);
  transition: opacity 150ms, transform 150ms;
}
.radio-option.selected .radio-dot {
  opacity: 1;
  transform: scale(1);
}
.radio-label {
  font-size: 14px;
  color: var(--rootsdk-text-primary);
}`;

export const ComponentsTab: React.FC = () => {
  const [switchOn, setSwitchOn] = useState(true);
  const [selectedItem, setSelectedItem] = useState(1);
  const [dropdownValue, setDropdownValue] = useState('option1');
  const [sliderValue, setSliderValue] = useState(75);
  const [radioValue, setRadioValue] = useState('voice');

  return (
    <div className="components-tab">
      {/* Buttons Section */}
      <section className="component-section">
        <h3>Buttons</h3>
        <p className="section-desc">
          Root uses pill-shaped buttons (border-radius: 9999px). Primary buttons use
          text-primary/background-tertiary for a theme-adaptive filled look.
        </p>
        <div className="demo-row">
          <button className="demo-button-primary">Primary</button>
          <button className="demo-button-outline">Outline</button>
          <button className="demo-button-danger">Danger</button>
          <button className="demo-button-primary" disabled>Disabled</button>
        </div>
        <CodeBlock code={BUTTON_CSS} title="Button CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Inputs Section */}
      <section className="component-section">
        <h3>Inputs</h3>
        <p className="section-desc">
          Inputs use border-radius: 12px and focus state changes border to brand-primary.
          For dropdowns, use a custom component (not native select) to match Root styling.
        </p>
        <div className="demo-inputs">
          <input className="demo-input" placeholder="Text input..." />
          <Dropdown
            options={[
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ]}
            value={dropdownValue}
            onChange={setDropdownValue}
            placeholder="Select an option"
          />
          <textarea className="demo-textarea" placeholder="Textarea..." rows={3} />
        </div>
        <CodeBlock code={INPUT_CSS} title="Input CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Panel/Card Section */}
      <section className="component-section">
        <h3>Panels & Cards</h3>
        <p className="section-desc">
          Panels use background-secondary with 1px border and 12px radius.
        </p>
        <div className="demo-panel">
          <div className="demo-panel-header">
            <h4 className="demo-panel-title">Panel Title</h4>
            <span className="demo-badge">Badge</span>
          </div>
          <p className="demo-panel-content">
            Panel content goes here. This is a standard card/panel container.
          </p>
        </div>
        <CodeBlock code={PANEL_CSS} title="Panel CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Switch Section */}
      <section className="component-section">
        <h3>Switch</h3>
        <p className="section-desc">
          Toggle switches use 44x24px dimensions with brand-primary when checked.
        </p>
        <div className="demo-row">
          <div
            className="demo-switch"
            data-checked={switchOn}
            onClick={() => setSwitchOn(!switchOn)}
            role="switch"
            aria-checked={switchOn}
          >
            <div className="demo-switch-thumb" />
          </div>
          <span className="demo-switch-label">
            Switch is {switchOn ? 'ON' : 'OFF'}
          </span>
        </div>
        <CodeBlock code={SWITCH_CSS} title="Switch CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Badges Section */}
      <section className="component-section">
        <h3>Badges</h3>
        <p className="section-desc">
          Badges are pill-shaped (border-radius: 9999px) with status color variants.
        </p>
        <div className="demo-row">
          <span className="demo-badge">Default</span>
          <span className="demo-badge demo-badge-info">Info</span>
          <span className="demo-badge demo-badge-warning">Warning</span>
          <span className="demo-badge demo-badge-error">Error</span>
        </div>
        <CodeBlock code={BADGE_CSS} title="Badge CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Alerts Section */}
      <section className="component-section">
        <h3>Alerts</h3>
        <p className="section-desc">
          Alerts use 10px border-radius with status color backgrounds.
        </p>
        <div className="demo-alerts">
          <div className="demo-alert">Default alert message</div>
          <div className="demo-alert demo-alert-info">Info: Something noteworthy happened</div>
          <div className="demo-alert demo-alert-warning">Warning: Please review this</div>
          <div className="demo-alert demo-alert-error">Error: Something went wrong</div>
        </div>
        <CodeBlock code={ALERT_CSS} title="Alert CSS" collapsible defaultExpanded={false} />
      </section>

      {/* List Items Section */}
      <section className="component-section">
        <h3>List Items</h3>
        <p className="section-desc">
          Interactive list items use highlight-normal on hover, highlight-strong when selected.
        </p>
        <div className="demo-list">
          {['Item 1', 'Item 2', 'Item 3'].map((item, i) => (
            <div
              key={i}
              className={`demo-list-item ${selectedItem === i ? 'selected' : ''}`}
              onClick={() => setSelectedItem(i)}
            >
              {item}
            </div>
          ))}
        </div>
        <CodeBlock code={LIST_ITEM_CSS} title="List Item CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Icon Buttons Section */}
      <section className="component-section">
        <h3>Icon Buttons</h3>
        <p className="section-desc">
          Square icon buttons with 6px radius and highlight-strong hover background.
        </p>
        <div className="demo-row">
          <button className="demo-icon-button" title="Settings">
            <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
              <path d="M18.9 10.66c-.16-.18-.25-.42-.25-.66s.09-.48.25-.66l1.28-1.44c.14-.16.23-.36.25-.57a1.1 1.1 0 0 0-.13-.62l-2-3.46a1.1 1.1 0 0 0-.46-.39 1.1 1.1 0 0 0-.61-.07l-1.88.38a1.1 1.1 0 0 1-.85-.11 1.1 1.1 0 0 1-.45-.55l-.61-1.83A1.1 1.1 0 0 0 12.64 0H8.64a1.1 1.1 0 0 0-1 .68L7.08 2.51a1.1 1.1 0 0 1-.45.55 1.1 1.1 0 0 1-.85.11L4 2.79a1.1 1.1 0 0 0-.57.09 1.1 1.1 0 0 0-.43.39l-2 3.46a1.1 1.1 0 0 0-.14.62c.02.21.1.41.24.57l1.27 1.44c.16.18.25.42.25.66s-.09.48-.25.66L1.1 12.1a1.1 1.1 0 0 0-.24.57 1.1 1.1 0 0 0 .14.62l2 3.46c.1.18.27.33.46.39.19.09.4.11.61.07l1.88-.38c.24-.05.49-.01.7.11.21.12.37.32.45.55l.61 1.83a1.1 1.1 0 0 0 1 .68h4a1.1 1.1 0 0 0 1-.68l.61-1.83c.08-.23.24-.43.45-.55.21-.12.46-.16.7-.11l1.88.38c.21.04.42.02.61-.07.19-.06.36-.21.46-.39l2-3.46c.11-.18.16-.39.13-.62a1.1 1.1 0 0 0-.25-.57l-1.35-1.44zm-1.49 1.34.8.9-1.28 2.22-1.18-.24a3.1 3.1 0 0 0-2.11.35 3.1 3.1 0 0 0-1.35 1.66l-.38 1.12H9.36l-.36-1.14a3.1 3.1 0 0 0-1.35-1.66 3.1 3.1 0 0 0-2.11-.35l-1.18.24L3.07 12.9l.8-.9a3.1 3.1 0 0 0 0-4.02l-.8-.9 1.28-2.2 1.18.23a3.1 3.1 0 0 0 2.11-.35A3.1 3.1 0 0 0 8.99 3.1l.38-1.1h2.56l.38 1.14a3.1 3.1 0 0 0 1.35 1.66 3.1 3.1 0 0 0 2.11.35l1.18-.24 1.28 2.22-.8.9a3.1 3.1 0 0 0 0 4.02zM10.64 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor"/>
            </svg>
          </button>
          <button className="demo-icon-button" title="Edit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 16.85v2.7c0 .25.2.45.44.45h2.7c.12 0 .23-.04.31-.13l9.71-9.7-3.33-3.33L4.13 16.54a.44.44 0 0 0-.13.31zm15.74-9.26a.88.88 0 0 0 0-1.25l-2.08-2.08a.88.88 0 0 0-1.25 0l-1.63 1.63 3.33 3.33 1.63-1.63z" fill="currentColor"/>
            </svg>
          </button>
          <button className="demo-icon-button" title="Close">
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
              <path d="M13.3.71a1 1 0 0 0-1.41 0L7 5.59 2.11.7A1 1 0 0 0 .7.7a1 1 0 0 0 0 1.41L5.59 7 .7 11.89a1 1 0 0 0 0 1.41 1 1 0 0 0 1.41 0L7 8.41l4.89 4.89a1 1 0 0 0 1.41 0 1 1 0 0 0 0-1.41L8.41 7l4.89-4.89a1 1 0 0 0 0-1.4z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        <CodeBlock code={ICON_BUTTON_CSS} title="Icon Button CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Slider Section */}
      <section className="component-section">
        <h3>Slider</h3>
        <p className="section-desc">
          Sliders use brand-primary for the fill, text-primary for the thumb, and highlight-strong for the track.
        </p>
        <div className="demo-slider-container">
          <div
            className="demo-slider-track"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              setSliderValue(Math.max(0, Math.min(100, percent)));
            }}
          >
            <div className="demo-slider-fill" style={{ width: `${sliderValue}%` }} />
            <div className="demo-slider-thumb" style={{ left: `${sliderValue}%` }} />
          </div>
          <span className="demo-slider-value">{sliderValue}%</span>
        </div>
        <CodeBlock code={SLIDER_CSS} title="Slider CSS" collapsible defaultExpanded={false} />
      </section>

      {/* Radio Buttons Section */}
      <section className="component-section">
        <h3>Radio Buttons</h3>
        <p className="section-desc">
          Radio options have a bordered container with brand-primary highlight when selected.
        </p>
        <div className="demo-radio-group">
          {[
            { value: 'voice', label: 'Voice activity' },
            { value: 'push', label: 'Push to talk' },
          ].map((option) => (
            <div
              key={option.value}
              className={`demo-radio-option ${radioValue === option.value ? 'selected' : ''}`}
              onClick={() => setRadioValue(option.value)}
            >
              <div className="demo-radio-squircle">
                <div className="demo-radio-dot" />
              </div>
              <span className="demo-radio-label">{option.label}</span>
            </div>
          ))}
        </div>
        <CodeBlock code={RADIO_CSS} title="Radio CSS" collapsible defaultExpanded={false} />
      </section>
    </div>
  );
};

export default ComponentsTab;
