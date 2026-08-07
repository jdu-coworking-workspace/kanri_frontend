import React from "react";
import Avatar from "../Avatar/Avatar";

const StudentCard = ({
  name,
  katakana,
  studentId,
  avatar,
  countryFlag,
  status,
  onClick,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 bg-kanri-surface p-4 rounded-xl cursor-pointer hover:bg-kanri-bg transition-colors ${className}`}
    >
      <div className="flex-shrink-0">
        <Avatar
          src={avatar}
          alt={name}
          size="lg"
          status={status}
          countryFlag={countryFlag}
        />
      </div>
      <div className="flex flex-col overflow-hidden">
        <h4 className="text-sm font-semibold text-brand-primary truncate">
          {name}
        </h4>
        {katakana && (
          <p className="text-xs text-brand-secondary truncate mt-0.5">
            {katakana}
          </p>
        )}
        <div className="mt-1">
          <span className="inline-block text-[10px] text-brand-secondary font-medium tracking-wide">
            {studentId}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
