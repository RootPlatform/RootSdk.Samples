import React, { useState, useMemo } from 'react';
import { CopyButton } from './CopyButton';

// Lightweight syntax highlighter using regex
// Supports CSS and TypeScript/JavaScript
type TokenType = 'comment' | 'string' | 'keyword' | 'property' | 'value' | 'selector' | 'punctuation' | 'text';

interface Token {
  type: TokenType;
  content: string;
}

const TS_KEYWORDS = /^(import|from|const|let|var|function|return|if|else|true|false|null|undefined|new|this|class|extends|export|default|async|await|try|catch|throw|interface|type|enum|implements|private|public|protected|readonly|static|void|never|any|unknown|string|number|boolean|object)$/;

function tokenizeCSS(code: string): Token[] {
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    // Comments /* */
    let match = remaining.match(/^(\/\*[\s\S]*?\*\/)/);
    if (match) {
      tokens.push({ type: 'comment', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Strings
    match = remaining.match(/^("[^"]*"|'[^']*')/);
    if (match) {
      tokens.push({ type: 'string', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // CSS var() function
    match = remaining.match(/^(var\([^)]+\))/);
    if (match) {
      tokens.push({ type: 'value', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // CSS property names (before colon)
    match = remaining.match(/^([a-z-]+)(\s*:)/);
    if (match) {
      tokens.push({ type: 'property', content: match[1] });
      tokens.push({ type: 'punctuation', content: match[2] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // CSS selectors (class, element, pseudo)
    match = remaining.match(/^([.#]?[a-zA-Z_][\w-]*(?:\[[^\]]+\])?(?::[\w-]+(?:\([^)]*\))?)*)/);
    if (match && !remaining.match(/^\s*[:{]/)) {
      // Only treat as selector if followed by { or at start of rule
      const lookAhead = remaining.slice(match[0].length).trimStart();
      if (lookAhead.startsWith('{') || lookAhead.startsWith(',') || lookAhead.startsWith('\n')) {
        tokens.push({ type: 'selector', content: match[1] });
        remaining = remaining.slice(match[1].length);
        continue;
      }
    }

    // Numbers with units
    match = remaining.match(/^(-?[\d.]+(?:px|em|rem|%|vh|vw|ms|s|deg)?)/);
    if (match) {
      tokens.push({ type: 'value', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Hex colors
    match = remaining.match(/^(#[a-fA-F0-9]{3,8})/);
    if (match) {
      tokens.push({ type: 'value', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Punctuation
    match = remaining.match(/^([{}();:,])/);
    if (match) {
      tokens.push({ type: 'punctuation', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Whitespace and other text
    match = remaining.match(/^(\s+|[^\s/'"{}();:,]+)/);
    if (match) {
      tokens.push({ type: 'text', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Fallback: single character
    tokens.push({ type: 'text', content: remaining[0] });
    remaining = remaining.slice(1);
  }

  return tokens;
}

function tokenizeTS(code: string): Token[] {
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    // Single-line comments
    let match = remaining.match(/^(\/\/[^\n]*)/);
    if (match) {
      tokens.push({ type: 'comment', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Multi-line comments
    match = remaining.match(/^(\/\*[\s\S]*?\*\/)/);
    if (match) {
      tokens.push({ type: 'comment', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Template strings
    match = remaining.match(/^(`[^`]*`)/);
    if (match) {
      tokens.push({ type: 'string', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Strings
    match = remaining.match(/^("[^"]*"|'[^']*')/);
    if (match) {
      tokens.push({ type: 'string', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Keywords and identifiers
    match = remaining.match(/^([a-zA-Z_$][\w$]*)/);
    if (match) {
      const word = match[1];
      if (TS_KEYWORDS.test(word)) {
        tokens.push({ type: 'keyword', content: word });
      } else {
        tokens.push({ type: 'text', content: word });
      }
      remaining = remaining.slice(word.length);
      continue;
    }

    // Numbers
    match = remaining.match(/^(\d+\.?\d*)/);
    if (match) {
      tokens.push({ type: 'value', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Operators and punctuation
    match = remaining.match(/^([<>!=]=?=?|[+\-*/%&|^~?:.,;{}()[\]]|=>)/);
    if (match) {
      tokens.push({ type: 'punctuation', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Whitespace
    match = remaining.match(/^(\s+)/);
    if (match) {
      tokens.push({ type: 'text', content: match[1] });
      remaining = remaining.slice(match[1].length);
      continue;
    }

    // Fallback
    tokens.push({ type: 'text', content: remaining[0] });
    remaining = remaining.slice(1);
  }

  return tokens;
}

// Export for use in other components
export function highlightCode(code: string, language: string): React.ReactNode {
  const tokenize = language === 'css' ? tokenizeCSS : tokenizeTS;
  const tokens = tokenize(code);

  return tokens.map((token, i) => {
    if (token.type === 'text') {
      return token.content;
    }
    return (
      <span key={i} className={`syntax-${token.type}`}>
        {token.content}
      </span>
    );
  });
}

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'css',
  title,
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const highlighted = useMemo(() => highlightCode(code, language), [code, language]);

  const header = (
    <div className="code-block-header">
      {title && <span className="code-block-title">{title}</span>}
      <div className="code-block-actions">
        <CopyButton text={code} label="Copy" />
        {collapsible && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="code-block-toggle"
            type="button"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="code-block">
      {(title || collapsible) && header}
      {(!collapsible || expanded) && (
        <pre className={`code-block-content language-${language}`}>
          <code>{highlighted}</code>
        </pre>
      )}
    </div>
  );
};

export default CodeBlock;
