import React from "react";
import { DEFAULT_VIEWBOX } from "../core/GameLogic";

interface IconProps {
  svg: string;
  size?: number;
  className?: string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  svg,
  size = 20,
  className = "",
  color,
}) => {
  const viewBoxMatch: RegExpMatchArray | null = svg.match(/viewBox="([^"]+)"/);
  const viewBox: string = viewBoxMatch ? viewBoxMatch[1] : DEFAULT_VIEWBOX;

  const innerMatch: RegExpMatchArray | null = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent: string = innerMatch ? innerMatch[1] : "";

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    color: color,
  };

  return (
    <span className={`icon ${className}`} style={containerStyle}>
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

export const Icons: Record<string, string> = {
  gamepad: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 7H9C6.24 7 4 9.24 4 12C4 14.76 6.24 17 9 17H15C17.76 17 20 14.76 20 12C20 9.24 17.76 7 15 7ZM9 14C8.45 14 8 13.55 8 13V12.5H7.5C6.95 12.5 6.5 12.05 6.5 11.5C6.5 10.95 6.95 10.5 7.5 10.5H8V10C8 9.45 8.45 9 9 9C9.55 9 10 9.45 10 10V10.5H10.5C11.05 10.5 11.5 10.95 11.5 11.5C11.5 12.05 11.05 12.5 10.5 12.5H10V13C10 13.55 9.55 14 9 14ZM14.5 13C13.95 13 13.5 12.55 13.5 12C13.5 11.45 13.95 11 14.5 11C15.05 11 15.5 11.45 15.5 12C15.5 12.55 15.05 13 14.5 13ZM16.5 11C15.95 11 15.5 10.55 15.5 10C15.5 9.45 15.95 9 16.5 9C17.05 9 17.5 9.45 17.5 10C17.5 10.55 17.05 11 16.5 11Z" fill="currentColor"/>
  </svg>`,

  users: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V18C1 18.55 1.45 19 2 19H14C14.55 19 15 18.55 15 18V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C15.05 13.06 15.06 13.08 15.07 13.09C16.21 13.92 17 15.03 17 16.5V18C17 18.35 16.93 18.69 16.82 19H22C22.55 19 23 18.55 23 18V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
  </svg>`,

  eye: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
  </svg>`,

  trophy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5H17V4C17 2.9 16.1 2 15 2H9C7.9 2 7 2.9 7 4V5H5C3.9 5 3 5.9 3 7V8C3 10.55 4.92 12.63 7.39 12.94C8.02 14.44 9.37 15.57 11 15.9V19H8C7.45 19 7 19.45 7 20C7 20.55 7.45 21 8 21H16C16.55 21 17 20.55 17 20C17 19.45 16.55 19 16 19H13V15.9C14.63 15.57 15.98 14.44 16.61 12.94C19.08 12.63 21 10.55 21 8V7C21 5.9 20.1 5 19 5ZM5 8V7H7V10.82C5.84 10.4 5 9.3 5 8ZM12 14C10.35 14 9 12.65 9 11V4H15V11C15 12.65 13.65 14 12 14ZM19 8C19 9.3 18.16 10.4 17 10.82V7H19V8Z" fill="currentColor"/>
  </svg>`,

  volumeHigh: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10V14C3 14.55 3.45 15 4 15H7L10.29 18.29C10.92 18.92 12 18.47 12 17.58V6.41C12 5.52 10.92 5.07 10.29 5.7L7 9H4C3.45 9 3 9.45 3 10ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 4.45V4.65C14 5.03 14.25 5.36 14.6 5.5C17.18 6.53 19 9.06 19 12C19 14.94 17.18 17.47 14.6 18.5C14.24 18.64 14 18.97 14 19.35V19.55C14 20.18 14.63 20.62 15.21 20.4C18.6 19.11 21 15.84 21 12C21 8.16 18.6 4.89 15.21 3.6C14.63 3.37 14 3.82 14 4.45Z" fill="currentColor"/>
  </svg>`,

  volumeOff: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.63 3.63C3.24 4.02 3.24 4.65 3.63 5.04L7.29 8.7L7 9H4C3.45 9 3 9.45 3 10V14C3 14.55 3.45 15 4 15H7L10.29 18.29C10.92 18.92 12 18.47 12 17.58V13.41L16.18 17.59C15.69 17.96 15.16 18.27 14.58 18.5C14.22 18.65 14 19.03 14 19.42C14 20.14 14.73 20.6 15.39 20.33C16.19 20 16.94 19.56 17.61 19.02L18.95 20.36C19.34 20.75 19.97 20.75 20.36 20.36C20.75 19.97 20.75 19.34 20.36 18.95L5.05 3.63C4.66 3.24 4.03 3.24 3.63 3.63ZM19 12C19 12.82 18.85 13.61 18.59 14.34L20.12 15.87C20.68 14.7 21 13.39 21 12C21 8.17 18.6 4.89 15.22 3.6C14.63 3.37 14 3.83 14 4.46V4.65C14 5.03 14.25 5.36 14.61 5.5C17.18 6.54 19 9.06 19 12ZM10.29 5.71L10.12 5.88L12 7.76V6.41C12 5.52 10.92 5.08 10.29 5.71ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V9.76L16.48 12.24C16.49 12.16 16.5 12.08 16.5 12Z" fill="currentColor"/>
  </svg>`,

  back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 11H7.83L12.71 6.12C13.1 5.73 13.1 5.09 12.71 4.7C12.32 4.31 11.69 4.31 11.3 4.7L4.71 11.29C4.32 11.68 4.32 12.31 4.71 12.7L11.3 19.29C11.69 19.68 12.32 19.68 12.71 19.29C13.1 18.9 13.1 18.27 12.71 17.88L7.83 13H19C19.55 13 20 12.55 20 12C20 11.45 19.55 11 19 11Z" fill="currentColor"/>
  </svg>`,

  robot: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 9V7C20 5.9 19.1 5 18 5H13V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V5H6C4.9 5 4 5.9 4 7V9C2.9 9 2 9.9 2 11V15C2 16.1 2.9 17 4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17C21.1 17 22 16.1 22 15V11C22 9.9 21.1 9 20 9ZM18 19H6V7H18V19ZM9 13C9.83 13 10.5 12.33 10.5 11.5C10.5 10.67 9.83 10 9 10C8.17 10 7.5 10.67 7.5 11.5C7.5 12.33 8.17 13 9 13ZM15 13C15.83 13 16.5 12.33 16.5 11.5C16.5 10.67 15.83 10 15 10C14.17 10 13.5 10.67 13.5 11.5C13.5 12.33 14.17 13 15 13ZM8 15H16C16.55 15 17 15.45 17 16C17 16.55 16.55 17 16 17H8C7.45 17 7 16.55 7 16C7 15.45 7.45 15 8 15Z" fill="currentColor"/>
  </svg>`,
};

export default Icon;
