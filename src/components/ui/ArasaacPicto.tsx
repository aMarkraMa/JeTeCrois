/**
 * ArasaacPicto Component
 * 
 * Reusable component to display ARASAAC pictograms using the ARASAAC API
 * 
 * @param id - ARASAAC pictogram ID (required)
 * @param size - Size as percentage or pixels (default: "25%")
 * @param backgroundColor - Background color (default: "none")
 * @param strikethrough - Show strikethrough (default: false)
 * @param hairColor - Hair color (default: "black")
 * @param skinColor - Skin color (default: "#cf9d7c")
 * @param plural - Show plural version (default: false)
 * @param color - Show in color (default: true)
 * @param alt - Alt text for accessibility (default: "ARASAAC pictogram")
 * @param className - Additional CSS classes
 */

import './ArasaacPicto.css';

interface ArasaacPictoProps {
  id: number;
  size?: string;
  backgroundColor?: string;
  strikethrough?: boolean;
  hairColor?: string;
  skinColor?: string;
  plural?: boolean;
  color?: boolean;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function ArasaacPicto({
  id,
  size = "25%",
  backgroundColor = "none",
  strikethrough = false,
  hairColor = "black",
  skinColor = "#cf9d7c",
  plural = false,
  color = true,
  alt = "ARASAAC pictogram",
  className = "",
  onClick,
}: ArasaacPictoProps) {
  // Build the ARASAAC API URL with parameters
  const buildUrl = () => {
    const baseUrl = `https://api.arasaac.org/v1/pictograms/${id}`;
    const params = new URLSearchParams({
      plural: plural.toString(),
      color: color.toString(),
      backgroundColor: backgroundColor,
      url: "false",
      download: "false",
    });

    // Add optional parameters only if they differ from defaults
    if (hairColor !== "black") {
      params.append("hair", hairColor);
    }
    if (skinColor !== "#cf9d7c") {
      params.append("skin", skinColor);
    }
    if (strikethrough) {
      params.append("action", "cross");
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const imageUrl = buildUrl();

  const style: React.CSSProperties = {
    width: size,
    height: "auto",
    display: "block",
  };

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`arasaac-picto ${className}`}
      style={style}
      onClick={onClick}
      loading="lazy"
    />
  );
}

