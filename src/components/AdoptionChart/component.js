import * as React from 'react';
import { safeDate, formatDate } from '../../utils/safe';

// Chart tokens — line color validated >= 3:1 on white; site accent used only as fill
const tokens = {
  line: '#2e7d32',
  fill: '#5cb85c',
  grid: '#e1e0d9',
  baseline: '#c3c2b7',
  muted: '#898781',
  ink: '#333',
};

// Earliest valid source date per ISP with (full or partial) IPv6 support
const adoptionEvents = ispData => ispData
  .filter(isp => isp.ipv6 === true && isp.sources && isp.sources.length > 0)
  .map(isp => {
    const dates = isp.sources.map(s => safeDate(s.date)).filter(Boolean);
    return dates.length ? { name: isp.name, date: new Date(Math.min(...dates)) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => a.date - b.date)
  .map((e, i) => ({ ...e, count: i + 1 }));

const AdoptionChart = ({ ispData }) => {
  const [hover, setHover] = React.useState(null);
  const events = React.useMemo(() => adoptionEvents(ispData), [ispData]);

  if (events.length < 2) return null;

  // Geometry (viewBox units)
  const W = 720, H = 280;
  const m = { top: 16, right: 56, bottom: 28, left: 34 };
  const iw = W - m.left - m.right, ih = H - m.top - m.bottom;

  const x0 = new Date(events[0].date.getFullYear(), 0, 1).getTime();
  const x1 = Date.now();
  const yMax = events.length + 1;
  const X = t => m.left + ((t - x0) / (x1 - x0)) * iw;
  const Y = c => m.top + ih - (c / yMax) * ih;

  // Step path (step-after): flat until the next event, then up
  let line = `M ${X(events[0].date.getTime())} ${Y(1)}`;
  for (let i = 1; i < events.length; i++) {
    line += ` H ${X(events[i].date.getTime())} V ${Y(events[i].count)}`;
  }
  line += ` H ${X(x1)}`;
  const area = `${line} V ${Y(0)} H ${X(events[0].date.getTime())} Z`;

  // Ticks: whole years on x (thinned to fit), integers on y
  const firstYear = events[0].date.getFullYear();
  const lastYear = new Date(x1).getFullYear();
  const yearStep = Math.max(1, Math.ceil((lastYear - firstYear) / 8));
  const xTicks = [];
  for (let y = firstYear; y <= lastYear; y += yearStep) xTicks.push(y);
  const yTickStep = yMax > 20 ? 10 : 5;
  const yTicks = [];
  for (let c = yTickStep; c <= yMax; c += yTickStep) yTicks.push(c);

  const onMove = e => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const { x } = pt.matrixTransform(svg.getScreenCTM().inverse());
    let nearest = events[0];
    for (const ev of events) {
      if (Math.abs(X(ev.date.getTime()) - x) < Math.abs(X(nearest.date.getTime()) - x)) nearest = ev;
    }
    setHover(nearest);
  };

  const last = events[events.length - 1];

  return (
    <figure style={{ margin: '40px 0 0' }}>
      <figcaption style={{ color: tokens.ink }}>
        <strong>Udviklingen over tid</strong><br/>
        <span style={{ color: tokens.muted, fontSize: '80%' }}>
          Antal udbydere på listen med fuld eller delvis IPv6-understøttelse, baseret på den ældste registrerede kilde pr. udbyder.
        </span>
      </figcaption>
      <div style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img"
          aria-label={`Graf: kumulativt antal internetudbydere med IPv6-understøttelse over tid, fra ${firstYear} til i dag. Aktuelt ${events.length} udbydere.`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {yTicks.map(c => (
            <g key={c}>
              <line x1={m.left} x2={W - m.right} y1={Y(c)} y2={Y(c)} stroke={tokens.grid} strokeWidth="1"/>
              <text x={m.left - 6} y={Y(c) + 4} textAnchor="end" fontSize="11" fill={tokens.muted}>{c}</text>
            </g>
          ))}
          <line x1={m.left} x2={W - m.right} y1={Y(0)} y2={Y(0)} stroke={tokens.baseline} strokeWidth="1"/>
          {xTicks.map(y => (
            <text key={y} x={X(new Date(y, 0, 1).getTime())} y={H - 8} textAnchor="middle" fontSize="11" fill={tokens.muted}>{y}</text>
          ))}
          <path d={area} fill={tokens.fill} fillOpacity="0.15"/>
          <path d={line} fill="none" stroke={tokens.line} strokeWidth="2" strokeLinejoin="round"/>
          <text x={X(x1) + 6} y={Y(last.count) + 4} fontSize="13" fontWeight="bold" fill={tokens.ink}>{last.count}</text>
          {hover && (
            <g pointerEvents="none">
              <line x1={X(hover.date.getTime())} x2={X(hover.date.getTime())} y1={m.top} y2={Y(0)} stroke={tokens.baseline} strokeWidth="1" strokeDasharray="3 3"/>
              <circle cx={X(hover.date.getTime())} cy={Y(hover.count)} r="4" fill={tokens.line} stroke="#fff" strokeWidth="2"/>
            </g>
          )}
        </svg>
        {hover && (
          <div style={{
            position: 'absolute',
            left: `${(X(hover.date.getTime()) / W) * 100}%`,
            top: 0,
            transform: X(hover.date.getTime()) > W / 2 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)',
            background: '#fff',
            border: `1px solid ${tokens.grid}`,
            borderRadius: '4px',
            padding: '6px 10px',
            fontSize: '12px',
            color: tokens.ink,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}>
            <strong>{formatDate(hover.date)}</strong><br/>
            {hover.count} {hover.count === 1 ? 'udbyder' : 'udbydere'} med IPv6<br/>
            <span style={{ color: tokens.muted }}>+ {hover.name}</span>
          </div>
        )}
      </div>
    </figure>
  );
};

export default AdoptionChart;
