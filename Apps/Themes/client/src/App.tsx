import React, { useState } from 'react';
import {
  ThemeApiTab,
  ColorsTab,
  ComponentsTab,
  IconsTab,
  ReferenceTab,
} from './tabs';
import './App.css';

type TabKey = 'theme' | 'colors' | 'components' | 'icons' | 'reference';

interface Tab {
  key: TabKey;
  label: string;
  description: string;
}

const TABS: Tab[] = [
  { key: 'theme', label: 'Theme API', description: 'Theme events and getTheme()' },
  { key: 'colors', label: 'Colors', description: 'All CSS color variables' },
  { key: 'components', label: 'Components', description: 'Live component examples' },
  { key: 'icons', label: 'Icons', description: 'Icon library gallery' },
  { key: 'reference', label: 'Reference', description: 'Quick reference & copy CSS' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('theme');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theme':
        return <ThemeApiTab />;
      case 'colors':
        return <ColorsTab />;
      case 'components':
        return <ComponentsTab />;
      case 'icons':
        return <IconsTab />;
      case 'reference':
        return <ReferenceTab />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">Root Design System</h1>
            <p className="app-subtitle">
              Theme integration, colors, components, and icons for Root apps
            </p>
          </div>
        </div>
      </header>

      <nav className="tabs-nav" role="tablist" aria-label="Design system sections">
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            aria-controls={`panel-${tab.key}`}
            id={`tab-${tab.key}`}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            title={tab.description}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main
        className="tab-content"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {renderTabContent()}
      </main>

      <footer className="app-footer">
        <p>
          Design tokens synced from <code>@rootplatform/ai-docs-single</code>.
          Run <code>node scripts/sync-from-ai-docs.js</code> to update.
        </p>
      </footer>
    </div>
  );
};

export default App;
