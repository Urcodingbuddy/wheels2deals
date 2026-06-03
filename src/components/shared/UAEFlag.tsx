import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function UAEFlag({ className, width = 24, height = 12, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 40 20"
      width={width}
      height={height}
      className={`inline-block shrink-0 rounded-[1px] shadow-sm ${className || ""}`}
      {...props}
    >
      {/* Red vertical band on the left (1/4 of width) */}
      <rect x="0" y="0" width="10" height="20" fill="#E31B23" />
      {/* Green horizontal band (top 1/3 of the remaining 3/4) */}
      <rect x="10" y="0" width="30" height="6.67" fill="#00732F" />
      {/* White horizontal band (middle 1/3 of the remaining 3/4) */}
      <rect x="10" y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      {/* Black horizontal band (bottom 1/3 of the remaining 3/4) */}
      <rect x="10" y="13.33" width="30" height="6.67" fill="#000000" />
    </svg>
  );
}
