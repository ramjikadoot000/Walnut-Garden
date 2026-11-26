import React from 'react';

interface StarTextProps {
  text: string;
  className?: string;
  goldClassName?: string;
}

/**
 * Renders any text string and transforms words/phrases wrapped in *stars*
 * into Gen-Z high-contrast editorial serif gold italics (`Instrument Serif`).
 */
export const StarText: React.FC<StarTextProps> = ({
  text,
  className = '',
  goldClassName = 'font-editorial-italic italic text-[#D4AF37] font-normal px-1',
}) => {
  if (!text) return null;

  const parts = text.split(/(\*[^*]+\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          const inner = part.slice(1, -1);
          return (
            <em key={index} className={goldClassName}>
              {inner}
            </em>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
