import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`copy-button ${copied ? 'copied' : ''} ${className}`}
      title={`Copy ${label}`}
      type="button"
    >
      {copied ? 'Copied!' : label}
    </button>
  );
};

export default CopyButton;
