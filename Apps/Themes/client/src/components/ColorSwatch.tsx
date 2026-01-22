import React, { useState } from 'react';

interface ColorSwatchProps {
  cssVariable: string;
  name: string;
  description: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  cssVariable,
  name,
  description,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`var(${cssVariable})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="color-swatch" title={description}>
      <div
        className="color-swatch-preview"
        style={{ backgroundColor: `var(${cssVariable})` }}
      />
      <div className="color-swatch-info">
        <code className="color-swatch-variable">{cssVariable}</code>
        <span className="color-swatch-name">{name}</span>
      </div>
      <button
        onClick={handleCopy}
        className={`color-swatch-copy ${copied ? 'copied' : ''}`}
        type="button"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default ColorSwatch;
