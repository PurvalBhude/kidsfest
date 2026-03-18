import React, { useMemo } from 'react';

// STEM-related emojis
const stemEmojis = ['🚀', '🔬', '🔭', '🧬', '⚙️', '💻', '💡', '🧪', '📐', '🤖', '🪐', '🧠', '🧲', '🔌', '📡', '👩‍🔬', '👨‍🚀', '🌌', '🔋'];

// Generate a random position for each emoji to spread them more evenly across the parent container
const generatePositions = (count) => {
  const positions = [];
  
  // We'll create a rough grid to ensure emojis don't clump too much on one side
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  
  const cellWidth = 120 / cols;
  const cellHeight = 120 / rows;

  let added = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (added >= count) break;

      // Base position within the cell (e.g., 0 to 100 percentages)
      const baseX = c * cellWidth;
      const baseY = r * cellHeight;
      
      // Randomize slightly within the cell so it doesn't look perfectly grid-aligned
      // Add a padding so they don't exactly touch the edges of the cell
      const randomOffsetX = Math.random() * (cellWidth * 0.8) + (cellWidth * 0.1);
      const randomOffsetY = Math.random() * (cellHeight * 0.8) + (cellHeight * 0.1);

      const left = baseX + randomOffsetX;
      const top = baseY + randomOffsetY;
      
      // Slight random rotation
      const rotate = Math.floor(Math.random() * 60) - 30;

      // Random scaling
      const scale = (Math.random() * 0.8 + 0.9).toFixed(2);

      // Pick random emoji
      const emojiStr = stemEmojis[Math.floor(Math.random() * stemEmojis.length)];

      positions.push({ left: `${left}%`, top: `${top}%`, rotate, scale, emoji: emojiStr });
      added++;
    }
  }
  
  // Optional: Shuffle the array so if we map by index, the order of rendering is randomized
  return positions.sort(() => Math.random() - 0.5);
};

export default function StemBackground({ numberOfEmojis = 40 }) {
  // Memoize positions based on count so they don't recalculate on every tiny render
  const positions = useMemo(() => generatePositions(numberOfEmojis), [numberOfEmojis]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none', // Critical: allows clicking elements underneath
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {positions.map((item, index) => (
        <span
          key={index}
          style={{
            position: 'absolute',
            left: item.left,
            top: item.top,
            transform: `rotate(${item.rotate}deg) scale(${item.scale})`,
            fontSize: '2rem', // Reduced from 2.5rem
            opacity: 0.18, // Increased opacity as requested
            userSelect: 'none', // Prevent text selection
            display: 'inline-block'
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
