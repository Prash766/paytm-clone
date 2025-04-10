import { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

const IconComponent = ({ 
  Icon, 
  className,
  isFocused = false 
}: { 
  Icon: LucideIcon | string; 
  className?: string;
  isFocused?: boolean 
}) => {
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof Icon === "string" && svgRef.current) {
      const svgElement = svgRef.current.querySelector('svg');
      if (svgElement) {
        if (isFocused) {
          svgElement.setAttribute('stroke-width', '2.5');
        }
      }
    }
  }, [isFocused, Icon]);

  return (
    <div className={`${className} ${isFocused ? "text-gray-800" : "text-gray-500"}`}>
      {typeof Icon === "string" ? (
        <div 
          ref={svgRef}
          dangerouslySetInnerHTML={{ __html: Icon }} 
        />
      ) : (
        <Icon 
          strokeWidth={isFocused ? 2 : 1.5} 
          fill={isFocused ? "currentColor" : "none"}
        />
      )}
    </div>
  );
};

export default IconComponent;