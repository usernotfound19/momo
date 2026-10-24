import React from 'react';

interface BouquetVisualProps {
  wrapperColor?: string; // hex or preset
  ribbonColor?: string;
  flowers: {
    flowerId: string;
    count: number;
    color?: string;
  }[];
  size?: 'sm' | 'md' | 'lg';
}

export const BouquetVisual: React.FC<BouquetVisualProps> = ({
  wrapperColor = '#FDF2F8',
  ribbonColor = '#E11D48',
  flowers,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-48 h-56',
    md: 'w-64 h-76 sm:w-72 sm:h-84',
    lg: 'w-72 h-88 sm:w-80 sm:h-96',
  };

  // Map flowers into positions and color coordinates
  const flowerColorMap: Record<string, { petal: string; center: string; secondary: string; type: string }> = {
    'red-rose': { petal: '#be123c', center: '#881337', secondary: '#e11d48', type: 'rose' },
    'pink-tulip': { petal: '#f472b6', center: '#db2777', secondary: '#fbcfe8', type: 'tulip' },
    'white-lily': { petal: '#f8fafc', center: '#fef08a', secondary: '#e2e8f0', type: 'lily' },
    'sunflower': { petal: '#eab308', center: '#713f12', secondary: '#facc15', type: 'sunflower' },
    'babys-breath': { petal: '#ffffff', center: '#94a3b8', secondary: '#f1f5f9', type: 'gyp' },
    'lavender': { petal: '#8b5cf6', center: '#6d28d9', secondary: '#a78bfa', type: 'lavender' },
    'blush-peony': { petal: '#fb7185', center: '#be123c', secondary: '#fda4af', type: 'peony' },
  };

  // Build rendered items based on counts
  const renderedFlowerList: { id: string; x: number; y: number; scale: number; rot: number; type: string; colors: { petal: string; center: string; secondary: string } }[] = [];

  let index = 0;
  flowers.forEach((f) => {
    const config = flowerColorMap[f.flowerId] || flowerColorMap['red-rose'];
    const count = Math.min(f.count, 6); // visual cap for balance
    for (let i = 0; i < count; i++) {
      // distribute in a dome shape
      const angle = (index / (flowers.reduce((a, b) => a + Math.min(b.count, 6), 0) || 1)) * Math.PI - Math.PI / 2;
      const radius = 30 + (i % 3) * 26;
      const x = 160 + Math.sin(angle) * radius * 1.6 + ((i * 17) % 20 - 10);
      const y = 140 - Math.cos(angle) * (radius * 0.7) - (i % 2 === 0 ? 15 : 0);
      const scale = 0.85 + ((i + index) % 3) * 0.12;
      const rot = (Math.sin(index + i) * 25);

      renderedFlowerList.push({
        id: `${f.flowerId}-${i}`,
        x,
        y,
        scale,
        rot,
        type: config.type,
        colors: config,
      });
      index++;
    }
  });

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]}`}>
      <svg
        viewBox="0 0 320 380"
        className="w-full h-full drop-shadow-xl transition-all duration-500 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wrapperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={wrapperColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.08)" />
          </filter>
        </defs>

        {/* Stems behind wrapper */}
        <g stroke="#3f6212" strokeWidth="3.5" strokeLinecap="round" opacity="0.8">
          <line x1="160" y1="180" x2="155" y2="350" />
          <line x1="140" y1="180" x2="148" y2="345" />
          <line x1="180" y1="180" x2="168" y2="348" />
          <line x1="125" y1="180" x2="158" y2="340" />
          <line x1="195" y1="180" x2="162" y2="342" />
        </g>

        {/* Greenery / Leaves foliage background */}
        <g fill="#4d7c0f" opacity="0.85">
          {/* Leaves spreading outward */}
          <path d="M110 130 C90 100, 70 120, 80 145 C95 155, 115 145, 110 130 Z" />
          <path d="M210 130 C230 100, 250 120, 240 145 C225 155, 205 145, 210 130 Z" />
          <path d="M150 90 C140 60, 170 55, 175 80 C170 95, 155 95, 150 90 Z" fill="#65a30d" />
          <path d="M85 170 C60 160, 65 185, 80 195 C95 195, 100 180, 85 170 Z" />
          <path d="M235 170 C260 160, 255 185, 240 195 C225 195, 220 180, 235 170 Z" />
        </g>

        {/* Wrapper Cone Paper */}
        <g filter="url(#softGlow)">
          {/* Back cone fold */}
          <polygon
            points="70,140 250,140 185,320 135,320"
            fill={wrapperColor}
            stroke="#e2d4cf"
            strokeWidth="1"
            opacity="0.95"
          />
          {/* Left wrapping fold */}
          <polygon
            points="65,145 160,200 140,320 110,230"
            fill={wrapperColor}
            opacity="0.9"
            stroke="#d6c5bf"
            strokeWidth="0.8"
          />
          {/* Right wrapping fold */}
          <polygon
            points="255,145 160,200 180,320 210,230"
            fill="#ffffff"
            opacity="0.65"
            stroke="#d6c5bf"
            strokeWidth="0.8"
          />
        </g>

        {/* Render flowers */}
        <g>
          {renderedFlowerList.map((flower) => {
            const { x, y, scale, rot, type, colors } = flower;

            if (type === 'sunflower') {
              return (
                <g key={flower.id} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
                  {/* Sunflower Petals */}
                  {Array.from({ length: 12 }).map((_, pi) => (
                    <ellipse
                      key={pi}
                      cx="0"
                      cy="-22"
                      rx="6"
                      ry="16"
                      fill={pi % 2 === 0 ? colors.petal : colors.secondary}
                      transform={`rotate(${pi * 30})`}
                    />
                  ))}
                  {/* Dark Center with texture */}
                  <circle cx="0" cy="0" r="14" fill={colors.center} />
                  <circle cx="0" cy="0" r="10" fill="#451a03" opacity="0.6" />
                  <circle cx="0" cy="0" r="5" fill="#fef08a" opacity="0.5" />
                </g>
              );
            }

            if (type === 'tulip') {
              return (
                <g key={flower.id} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
                  {/* Tulip Cup Petals */}
                  <path d="M-15 10 C-22 -15, -10 -30, 0 -35 C10 -30, 22 -15, 15 10 C10 18, -10 18, -15 10 Z" fill={colors.petal} />
                  <path d="M-8 8 C-14 -12, -4 -28, 0 -30 C4 -28, 14 -12, 8 8 Z" fill={colors.secondary} opacity="0.75" />
                  <ellipse cx="0" cy="-6" rx="6" ry="12" fill={colors.center} opacity="0.3" />
                </g>
              );
            }

            if (type === 'lily') {
              return (
                <g key={flower.id} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
                  {/* 6 Elegant Star Petals */}
                  {Array.from({ length: 6 }).map((_, li) => (
                    <path
                      key={li}
                      d="M0 0 C-7 -15, -6 -32, 0 -38 C6 -32, 7 -15, 0 0 Z"
                      fill={colors.petal}
                      stroke="#cbd5e1"
                      strokeWidth="0.5"
                      transform={`rotate(${li * 60})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="5" fill={colors.center} />
                </g>
              );
            }

            if (type === 'gyp') {
              return (
                <g key={flower.id} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
                  {/* Cloud of small delicate white blossoms */}
                  {[-12, 0, 14, -8, 10].map((bx, bi) => (
                    <g key={bi} transform={`translate(${bx}, ${bi * -5})`}>
                      <circle cx="0" cy="0" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
                      <circle cx="0" cy="0" r="1" fill="#fef08a" />
                    </g>
                  ))}
                </g>
              );
            }

            if (type === 'lavender') {
              return (
                <g key={flower.id} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
                  {/* Lavender Spire */}
                  <line x1="0" y1="10" x2="0" y2="-35" stroke="#4d7c0f" strokeWidth="1.5" />
                  {[-30, -24, -18, -12, -6, 0].map((ly, lidx) => (
                    <g key={lidx} transform={`translate(0, ${ly})`}>
                      <ellipse cx="-4" cy="0" rx="3.5" ry="2" fill={colors.petal} transform="rotate(-20)" />
                      <ellipse cx="4" cy="0" rx="3.5" ry="2" fill={colors.secondary} transform="rotate(20)" />
                    </g>
                  ))}
                </g>
              );
            }

            // Default: Velvety Rose / Peony
            return (
              <g key={flower.id} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
                {/* Outer Petals */}
                <circle cx="0" cy="0" r="21" fill={colors.petal} />
                {Array.from({ length: 6 }).map((_, rpi) => (
                  <path
                    key={rpi}
                    d="M-14 2 C-18 -12, 0 -22, 14 -14 C18 -2, 6 12, -14 2 Z"
                    fill={colors.secondary}
                    opacity="0.9"
                    transform={`rotate(${rpi * 60})`}
                  />
                ))}
                {/* Layered swirling Rose Center */}
                <circle cx="0" cy="0" r="11" fill={colors.center} />
                <path
                  d="M-5 -2 C-3 -7, 5 -7, 6 -1 C7 5, -2 6, -5 -2 Z"
                  fill={colors.petal}
                />
                <circle cx="0" cy="0" r="3.5" fill="#ffd1dc" opacity="0.4" />
              </g>
            );
          })}
        </g>

        {/* Satin / Velvet Ribbon Tied Around Wrapper */}
        <g filter="url(#softGlow)">
          {/* Ribbon Waist Wrap */}
          <rect
            x="130"
            y="260"
            width="60"
            height="14"
            rx="5"
            fill={ribbonColor}
            opacity="0.95"
          />
          {/* Ribbon Knot */}
          <circle cx="160" cy="267" r="7.5" fill={ribbonColor} stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />

          {/* Ribbon Bow Loops */}
          <path
            d="M160 267 C140 250, 125 260, 138 275 C146 278, 155 272, 160 267 Z"
            fill={ribbonColor}
          />
          <path
            d="M160 267 C180 250, 195 260, 182 275 C174 278, 165 272, 160 267 Z"
            fill={ribbonColor}
          />

          {/* Ribbon Tails hanging down */}
          <path
            d="M157 270 Q145 295 142 320 Q148 318 154 315 Q158 290 157 270 Z"
            fill={ribbonColor}
          />
          <path
            d="M163 270 Q175 295 178 320 Q172 318 166 315 Q162 290 163 270 Z"
            fill={ribbonColor}
          />
        </g>
      </svg>
    </div>
  );
};
