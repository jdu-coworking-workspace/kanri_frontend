import React from "react";
import Image from "next/image";

const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  status,
  countryFlag,
  className = "",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const statusColors = {
    online: "bg-status-online",
    offline: "bg-gray-400",
    recording: "bg-status-recording",
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`relative inline-block ${sizeClass} ${className}`}>
      <div className="relative w-full h-full rounded-full overflow-hidden border border-kanri-border bg-kanri-bg">
        {src ? (
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 font-semibold text-sm">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Status dot */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white ${
            statusColors[status] || statusColors.offline
          }`}
        />
      )}

      {/* Country Flag Badge */}
      {countryFlag && (
        <span
          className="absolute -bottom-1 -left-1 flex items-center justify-center bg-white border border-kanri-border rounded-full text-[10px] w-4 h-4 shadow-sm"
          title="Country Flag"
        >
          {countryFlag}
        </span>
      )}
    </div>
  );
};

export default Avatar;
