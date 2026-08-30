import React from "react";
import Avatar from "../Avatar/Avatar";

const StudentCard = ({
  id,
  name,
  katakana,
  studentId,
  avatar,
  countryFlag,
  status,
  workStatus,
  gradDate,
  onClick,
  className = "",
  isLeader,
  groupCount,
}) => {
  return (
    <div
      onClick={onClick}
      draggable={!!id}
      onDragStart={(e) => {
        if (id) {
          e.dataTransfer.setData("text/plain", JSON.stringify({
            sourceProjectId: null,
            studentId: id
          }));
        }
      }}
      className={`flex items-center gap-2 
        bg-[#f5f5f5] dark:bg-gray-800 
        p-2 rounded-lg cursor-pointer 
        border border-transparent 
        hover:border-kanri-secondary dark:border-white/10 dark:hover:border-white 
        transition-colors duration-150 ${className}`}
    >
      <Avatar
        src={avatar}
        alt={name}
        size="lg"
        status={status}
        workStatus={workStatus}
        gradDate={gradDate}
        countryFlag={countryFlag}
        isLeader={isLeader}
        groupCount={groupCount}
      />
      <div className="flex flex-col overflow-hidden">
        {/* Ism (Light: brand-primary, Dark: white) */}
        <h4 className="text-sm font-semibold text-brand-primary dark:text-white truncate">
          {name}
        </h4>

        {/* Katakana (Light: kanri-primary, Dark: gray-300) */}
        {katakana && (
          <p className="text-xs text-kanri-primary dark:text-gray-300 truncate my-0.5">
            {katakana}
          </p>
        )}

        {/* Student ID (Light: #8897AD, Dark: gray-400) */}
        <div className="text-xs text-[#8897AD] dark:text-gray-400 font-medium tracking-wide">
          {studentId}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;