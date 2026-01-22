import React from 'react';

interface IconProps {
  svg: string;
  size?: number;
  className?: string;
  color?: string;
}

/**
 * Renders an SVG icon from inline SVG string.
 * Icons use currentColor, so set the color via CSS or the color prop.
 */
export const Icon: React.FC<IconProps> = ({
  svg,
  size = 20,
  className = '',
  color
}) => {
  // Extract viewBox from the SVG string
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  // Extract the inner content (path elements) from the SVG
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = innerMatch ? innerMatch[1] : '';

  return (
    <span
      className={`icon ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color: color
      }}
    >
      <svg
        viewBox={viewBox}
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{ __html: innerContent }}
      />
    </span>
  );
};

export default Icon;
