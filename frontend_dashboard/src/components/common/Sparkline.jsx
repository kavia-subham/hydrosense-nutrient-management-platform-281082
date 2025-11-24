import React, { memo, useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Sparkline
 * Accessible, dependency-free SVG sparkline for small time-series.
 * - values: array of { t: number, v: number } or array<number>
 * - width/height: size in px
 * - stroke: color for line
 * - fill: optional fill under the curve (transparent if omitted)
 */
function SparklineBase({
  values,
  width = 180,
  height = 48,
  stroke = 'var(--color-primary)',
  fill = 'none',
  'aria-label': ariaLabel = 'trend line',
}) {
  const points = useMemo(() => {
    if (!Array.isArray(values) || values.length === 0) return [];
    const series = typeof values[0] === 'number' ? values.map((v, i) => ({ t: i, v })) : values;

    const minV = Math.min(...series.map((p) => p.v));
    const maxV = Math.max(...series.map((p) => p.v));
    const spanV = maxV - minV || 1;

    const minT = Math.min(...series.map((p) => p.t));
    const maxT = Math.max(...series.map((p) => p.t));
    const spanT = maxT - minT || 1;

    const pad = 2;
    const w = width - pad * 2;
    const h = height - pad * 2;

    return series.map((p) => {
      const x = pad + ((p.t - minT) / spanT) * w;
      const y = pad + h - ((p.v - minV) / spanV) * h;
      return `${x},${y}`;
    });
  }, [values, width, height]);

  if (!points.length) {
    return (
      <svg role="img" aria-label={`${ariaLabel} (no data)`} width={width} height={height} />
    );
  }

  const path = `M ${points.join(' L ')}`;
  const baseLineY = height - 2;

  return (
    <svg role="img" aria-label={ariaLabel} width={width} height={height}>
      {fill !== 'none' && (
        <path
          d={`${path} L ${width - 2},${baseLineY} L 2,${baseLineY} Z`}
          fill={fill}
          stroke="none"
          opacity="0.12"
        />
      )}
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default memo(SparklineBase);
