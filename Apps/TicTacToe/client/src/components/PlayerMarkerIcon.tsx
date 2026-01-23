import React from "react";
import { MarkerIcons, DEFAULT_VIEWBOX } from "../core/GameLogic";

interface PlayerMarkerIconProps {
  marker: "X" | "O";
}

export const PlayerMarkerIcon: React.FC<PlayerMarkerIconProps> = ({ marker }) => {
  const svg: string = marker === "X" ? MarkerIcons.X : MarkerIcons.O;
  const viewBoxMatch: RegExpMatchArray | null = svg.match(/viewBox="([^"]+)"/);
  const viewBox: string = viewBoxMatch ? viewBoxMatch[1] : DEFAULT_VIEWBOX;
  const innerMatch: RegExpMatchArray | null = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent: string = innerMatch ? innerMatch[1] : "";

  return (
    <svg
      viewBox={viewBox}
      className={`player-marker-icon ${marker.toLowerCase()}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: innerContent }}
    />
  );
};
