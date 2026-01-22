import React, { useState, useMemo } from 'react';
import { Icon, CopyButton, Dropdown, highlightCode } from '../components';
import iconsData from '../generated/icons.json';
import './IconsTab.css';

interface IconData {
  name: string;
  category: string;
  description: string;
  svg: string;
  viewBox: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'actions': 'Actions',
  'categories': 'Categories',
  'favorites': 'Favorites',
  'files': 'Files',
  'form': 'Form',
  'formatting': 'Formatting',
  'media': 'Media',
  'media-controls': 'Media Controls',
  'messaging': 'Messaging',
  'navigation': 'Navigation',
  'notifications': 'Notifications',
  'users': 'Users',
};

export const IconsTab: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const icons = iconsData.icons as IconData[];
  const categories = iconsData.categories as string[];

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    return icons.filter(icon => {
      const matchesSearch = !searchQuery ||
        icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || icon.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [icons, searchQuery, selectedCategory]);

  // Group icons by category
  const iconsByCategory = useMemo(() => {
    const grouped = new Map<string, IconData[]>();
    filteredIcons.forEach(icon => {
      const existing = grouped.get(icon.category) || [];
      existing.push(icon);
      grouped.set(icon.category, existing);
    });
    return grouped;
  }, [filteredIcons]);

  const generateUsageCode = (icon: IconData) => {
    return `<span style={{ color: "var(--rootsdk-text-primary)" }}>
  ${icon.svg.trim()}
</span>`;
  };

  return (
    <div className="icons-tab">
      <div className="icons-header">
        <div className="icons-intro">
          <h3>Root Icon Library</h3>
          <p>
            {iconsData.totalIcons} icons across {categories.length} categories.
            Icons use <code>fill="currentColor"</code> for theme-aware rendering.
          </p>
        </div>

        <div className="icons-filters">
          <input
            type="text"
            className="icons-search"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Dropdown
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({
                value: cat,
                label: CATEGORY_LABELS[cat] || cat,
              })),
            ]}
            value={selectedCategory || ''}
            onChange={val => setSelectedCategory(val || null)}
          />
        </div>
      </div>

      <div className="icons-content">
        <div className="icons-gallery">
          {categories.map(category => {
            const categoryIcons = iconsByCategory.get(category);
            if (!categoryIcons || categoryIcons.length === 0) return null;

            return (
              <section key={category} className="icon-category-section">
                <h4 className="icon-category-title">
                  {CATEGORY_LABELS[category] || category}
                  <span className="icon-count">{categoryIcons.length}</span>
                </h4>
                <div className="icon-grid">
                  {categoryIcons.map(icon => (
                    <button
                      key={icon.name}
                      className={`icon-card ${selectedIcon?.name === icon.name ? 'selected' : ''}`}
                      onClick={() => setSelectedIcon(icon)}
                      title={icon.description}
                    >
                      <Icon svg={icon.svg} size={24} />
                      <span className="icon-name">{icon.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}

          {filteredIcons.length === 0 && (
            <div className="no-results">
              No icons found matching "{searchQuery}"
            </div>
          )}
        </div>

        {selectedIcon && (
          <div className="icon-detail-panel">
            <div className="icon-detail-header">
              <h4>{selectedIcon.name}</h4>
              <button
                className="icon-detail-close"
                onClick={() => setSelectedIcon(null)}
              >
                ×
              </button>
            </div>

            <div className="icon-detail-preview">
              <Icon svg={selectedIcon.svg} size={48} />
            </div>

            <div className="icon-detail-info">
              <div className="detail-row">
                <span className="detail-label">Category</span>
                <span className="detail-value">
                  {CATEGORY_LABELS[selectedIcon.category] || selectedIcon.category}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description</span>
                <span className="detail-value">{selectedIcon.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">ViewBox</span>
                <span className="detail-value">{selectedIcon.viewBox}</span>
              </div>
            </div>

            <div className="icon-detail-actions">
              <CopyButton text={selectedIcon.svg} label="Copy SVG" />
              <CopyButton text={generateUsageCode(selectedIcon)} label="Copy Usage" />
            </div>

            <div className="icon-detail-code">
              <div className="code-label">SVG Code:</div>
              <pre className="code-content">
                <code>{highlightCode(selectedIcon.svg.trim(), 'typescript')}</code>
              </pre>
            </div>

            <div className="icon-color-demos">
              <div className="color-demo-label">Color Examples:</div>
              <div className="color-demo-row">
                <span style={{ color: 'var(--rootsdk-text-primary)' }}>
                  <Icon svg={selectedIcon.svg} size={20} />
                </span>
                <span style={{ color: 'var(--rootsdk-text-secondary)' }}>
                  <Icon svg={selectedIcon.svg} size={20} />
                </span>
                <span style={{ color: 'var(--rootsdk-brand-primary)' }}>
                  <Icon svg={selectedIcon.svg} size={20} />
                </span>
                <span style={{ color: 'var(--rootsdk-error)' }}>
                  <Icon svg={selectedIcon.svg} size={20} />
                </span>
                <span style={{ color: 'var(--rootsdk-warning)' }}>
                  <Icon svg={selectedIcon.svg} size={20} />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="icons-usage-section">
        <h4>Usage</h4>
        <p>
          Icons use <code>fill="currentColor"</code> which means they inherit their color
          from the parent element's CSS <code>color</code> property. Set the color using
          Root's CSS variables:
        </p>
        <pre className="usage-code">
          <code>{highlightCode(`<span style={{ color: "var(--rootsdk-text-primary)" }}>
  <svg viewBox="0 0 24 24" fill="none">
    <path fill="currentColor" d="..." />
  </svg>
</span>`, 'typescript')}</code>
        </pre>
      </section>
    </div>
  );
};

export default IconsTab;
