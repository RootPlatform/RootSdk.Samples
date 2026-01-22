import React, { useMemo } from 'react';
import { ColorSwatch, highlightCode } from '../components';
import designTokens from '../generated/design-tokens.json';
import './ColorsTab.css';

interface ColorToken {
  name: string;
  cssVariable: string;
  description: string;
  category: string;
}

const CATEGORY_ORDER = [
  'brand',
  'text',
  'background',
  'surface',
  'interactive',
  'status',
  'mention',
  'special',
];

const CATEGORY_LABELS: Record<string, string> = {
  brand: 'Brand Colors',
  text: 'Text Colors',
  background: 'Background Colors',
  surface: 'Surface Colors',
  interactive: 'Interactive Colors',
  status: 'Status Colors',
  mention: 'Mention Colors',
  special: 'Special Colors',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  brand: 'Primary brand colors for buttons, accents, and key interactive elements.',
  text: 'Text colors for different levels of emphasis and contexts.',
  background: 'Background colors for content areas, cards, and nested elements.',
  surface: 'Surface colors for elevated elements like modals and popovers.',
  interactive: 'Colors for interactive elements like inputs, borders, and highlights.',
  status: 'Semantic colors for feedback states like info, warning, and error.',
  mention: 'Background colors for @mention highlights in chat.',
  special: 'Special-purpose colors for specific effects.',
};

export const ColorsTab: React.FC = () => {
  const colorsByCategory = useMemo(() => {
    const colors = designTokens.colors as ColorToken[];
    const grouped = new Map<string, ColorToken[]>();

    colors.forEach(color => {
      const existing = grouped.get(color.category) || [];
      existing.push(color);
      grouped.set(color.category, existing);
    });

    return grouped;
  }, []);

  return (
    <div className="colors-tab">
      <div className="colors-intro">
        <h3>Root SDK CSS Color Variables</h3>
        <p>
          These CSS variables are <strong>automatically set by the Root hosting environment</strong> based
          on the user's theme preference. Just reference them in your CSS - they'll adapt to light/dark
          mode automatically.
        </p>
        <div className="usage-example">
          <code>{highlightCode('background-color: var(--rootsdk-background-secondary);', 'css')}</code>
        </div>
      </div>

      {CATEGORY_ORDER.map(category => {
        const colors = colorsByCategory.get(category);
        if (!colors || colors.length === 0) return null;

        return (
          <section key={category} className="color-category">
            <div className="category-header">
              <h4>{CATEGORY_LABELS[category] || category}</h4>
              <p>{CATEGORY_DESCRIPTIONS[category]}</p>
            </div>
            <div className="color-grid">
              {colors.map(color => (
                <ColorSwatch
                  key={color.cssVariable}
                  cssVariable={color.cssVariable}
                  name={color.name}
                  description={color.description}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="colors-tips">
        <h4>Usage Tips</h4>
        <ul>
          <li>
            <strong>Primary vs Secondary vs Tertiary:</strong> Use primary for main content,
            secondary for cards/panels, tertiary for nested or de-emphasized elements.
          </li>
          <li>
            <strong>Text hierarchy:</strong> text-primary for body text, text-secondary for
            labels, text-tertiary for placeholders and disabled states.
          </li>
          <li>
            <strong>Highlights:</strong> highlight-light for subtle hover, highlight-normal
            for standard hover, highlight-strong for active/pressed states.
          </li>
          <li>
            <strong>text-white is special:</strong> It stays white regardless of theme,
            intended for text on colored backgrounds like brand-primary buttons.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ColorsTab;
