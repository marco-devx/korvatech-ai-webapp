/** Static SVG version of the corridor, shown before hydration and for reduced motion. */
export function HeroFallback({ className }: { className?: string }) {
  const W = 1600;
  const H = 900;
  const cx = W / 2;
  const cy = H / 2;
  const lines: string[] = [];
  const per = 18;
  const pts: [number, number][] = [];
  for (let i = 0; i < per; i++) {
    const t = (i + 0.5) / per;
    pts.push([t * W, 0], [W, t * H], [W - t * W, H], [0, H - t * H]);
  }
  for (const [x, y] of pts) lines.push(`M${cx},${cy} L${x},${y}`);
  const rings = [0.12, 0.26, 0.45, 0.7].map((s) => {
    const w = (W * s) / 2;
    const h = (H * s) / 2;
    return `M${cx - w},${cy - h} H${cx + w} V${cy + h} H${cx - w} Z`;
  });
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="kv-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#152726" stopOpacity="1" />
          <stop offset="55%" stopColor="#152726" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#152726" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="#3f544c" strokeWidth="1" fill="none" opacity="0.9">
        {lines.map((d, i) => (
          <path key={d} d={d} stroke={i % 13 === 0 ? "#6b563f" : undefined} />
        ))}
        {rings.map((d) => (
          <path key={d} d={d} stroke="#2a403a" />
        ))}
      </g>
      <rect
        x={cx + 420}
        y={cy - 120}
        width="44"
        height="44"
        fill="none"
        stroke="#d4aa80"
        strokeWidth="1.5"
      />
      <rect x={cx + 434} y={cy - 106} width="16" height="16" fill="#d4aa80" />
      <rect width={W} height={H} fill="url(#kv-fade)" />
    </svg>
  );
}
