import React, { useState } from "react";
import "./App.css";

type ColorSwatchesProps = {
  vars: string[];
};

type ColorSwatchItemProps = {
  cssVar: string;
};

const ColorSwatchItem: React.FC<ColorSwatchItemProps> = ({ cssVar }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cssVar);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="swatch-item">
      <div
        className="swatch-color"
        style={{ background: `var(${cssVar}, transparent)` }}
        aria-label={`${cssVar} swatch`}
      />
      <div className="swatch-footer">
        {/* Tooltip with full name */}
        <code title={cssVar}>{cssVar}</code>
        <button
          onClick={handleCopy}
          className={`copy-btn ${copied ? "copied" : ""}`}
          title="Copy variable name"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        {/* Removed the small preview rectangle */}
      </div>
    </div>
  );
};

const ColorSwatches: React.FC<ColorSwatchesProps> = ({ vars }) => {
  return (
    <div className="swatches-grid">
      {vars.map((v) => (
        <ColorSwatchItem key={v} cssVar={v} />
      ))}
    </div>
  );
};

export default ColorSwatches;
