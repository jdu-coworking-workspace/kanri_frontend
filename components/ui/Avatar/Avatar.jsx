import React from "react";
import Image from "next/image";

const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  status, // "A", "B", "C", "S", "D", "E"
  isLeader = false,
  groupCount,
  countryFlag,
  className = "",
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  // Status ranglari va 80% opasiteli shadow stillari
  const statusConfig = {
    A: {
      bg: "bg-[#F53B26]",
      shadow: "shadow-[0_2px_6px_rgba(245,59,38,0.8)]",
    },
    B: {
      bg: "bg-[#2EA60D]",
      shadow: "shadow-[0_2px_6px_rgba(46,166,13,0.8)]",
    },
    S: {
      bg: "bg-[#DEDB01]",
      shadow: "shadow-[0_2px_6px_rgba(222,219,1,0.8)]",
    },
    C: {
      bg: "bg-[#858784]",
      shadow: "shadow-[0_2px_6px_rgba(133,135,132,0.8)]",
    },
    D: {
      bg: "bg-[#858784]",
      shadow: "shadow-[0_2px_6px_rgba(133,135,132,0.8)]",
    },
    E: {
      bg: "bg-[#858784]",
      shadow: "shadow-[0_2px_6px_rgba(133,135,132,0.8)]",
    },
  };

  const sizeClass = sizes[size] || sizes.md;
  const currentStatus = statusConfig[status?.toUpperCase()];

  return (
    <div className={`relative inline-block ${sizeClass} ${className}`}>
      {/* Asosiy Avatar ramkasi */}
      <div className="relative w-full h-full overflow-hidden rounded-lg border border-kanri-border bg-kanri-bg">
        {src ? (
          <Image
            src={src}
            alt={alt}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 font-semibold text-sm">
            {alt.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Group Count Badge (Yuqori o'ng burchak) */}
      {groupCount !== undefined && groupCount !== null && (
        <span className="absolute top-1 left-1 z-10 flex items-center justify-center w-[20px] h-[14px] bg-[#122B31] text-white rounded-xl text-[9px] font-bold leading-none">
          {groupCount}
        </span>
      )}

      {/* Status Badge (Pastki o'ng burchak, bottom: 3px, right: 3px) */}
      {currentStatus && (
        <span
          className={`absolute bottom-[3px] right-[3px] z-10 flex items-center justify-center w-[14px] h-[14px] rounded-full text-white text-[8px] font-bold leading-none ${currentStatus.bg} ${currentStatus.shadow}`}
        >
          {status.toUpperCase()}
        </span>
      )}

      {/* Leader Badge (Pastki chap burchak, bottom: 3px, left: 3px) */}
      {isLeader && (
        <span className="absolute bottom-[3px] left-[3px] z-10 flex items-center justify-center w-[14px] h-[14px] bg-[#FFD500] rounded-[2px] shadow-sm">
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_31_249)">
              <path
                d="M3.99995 5.91657L1.94261 6.99824L2.33561 4.70724L0.668945 3.0849L2.96895 2.75157L3.99761 0.667236L5.02628 2.75157L7.32628 3.0849L5.65961 4.70724L6.05261 6.99824L3.99995 5.91657Z"
                fill="#122B31"
                stroke="#122B31"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_31_249">
                <rect width="8" height="8" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
      )}

      {/* Country Flag Badge (IsLeader bo'lmaganda ko'rinadi) */}
      {countryFlag && !isLeader && (
        <span
          className="absolute -bottom-1 -left-1 z-10 flex items-center justify-center bg-white border border-kanri-border rounded-full text-[10px] w-4 h-4 shadow-sm"
          title="Country Flag"
        >
          {countryFlag}
        </span>
      )}
    </div>
  );
};

export default Avatar;