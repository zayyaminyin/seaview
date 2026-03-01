"use client";

type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  className?: string;
};

export function Sparkline({
  data,
  width = 80,
  height = 24,
  strokeColor = "#1565a0",
  fillColor,
  strokeWidth = 1.5,
  className = "",
}: SparklineProps) {
  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * innerW;
    const y = padding + innerH - ((v - min) / range) * innerH;
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const fillPath = fillColor
    ? `${linePath} L ${padding + innerW},${padding + innerH} L ${padding},${padding + innerH} Z`
    : "";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      {fillColor && (
        <path d={fillPath} fill={fillColor} opacity={0.15} />
      )}
      <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dot at end */}
      {data.length > 1 && (
        <circle
          cx={parseFloat(points[points.length - 1].split(",")[0])}
          cy={parseFloat(points[points.length - 1].split(",")[1])}
          r={2}
          fill={strokeColor}
        />
      )}
    </svg>
  );
}
