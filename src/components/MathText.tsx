import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathTextProps {
  text: string;
}

export function MathText({ text }: MathTextProps) {
  // Split text into math and non-math parts
  const parts = text.split(/(\$.*?\$)/g);

  return (
    <div className="math-text">
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // Remove the $ delimiters and determine if it's inline or block math
          const math = part.slice(1, -1);
          const isBlock = math.includes('\n');
          
          return isBlock ? (
            <BlockMath key={index} math={math} />
          ) : (
            <InlineMath key={index} math={math} />
          );
        }
        // Handle markdown-style bold text
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={index}>
            {boldParts.map((boldPart, boldIndex) => {
              if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                return (
                  <strong key={boldIndex}>
                    {boldPart.slice(2, -2)}
                  </strong>
                );
              }
              return boldPart;
            })}
          </span>
        );
      })}
    </div>
  );
} 