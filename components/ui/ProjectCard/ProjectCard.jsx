import React from "react";
import { Calendar, MoreHorizontal, Plus } from "lucide-react";
import Tag from "../Tag/Tag";
import Avatar from "../Avatar/Avatar";
import Image from "next/image";

const ProjectCard = ({
  title,
  tags = [],
  dateRange,
  students = [],
  maxVisibleStudents = 4,
  totalSlots = 8,
  onMenuClick,
  className = "",
  coverImage,
}) => {
  const visibleStudents = students.slice(0, maxVisibleStudents);
  const emptySlots = Math.max(0, totalSlots - visibleStudents.length);

  return (
    <div
      className={`flex flex-col bg-kanri-surface rounded-[24px] overflow-hidden border border-kanri-border relative ${className}`}
    >
      {/* Top Background Section (Curve simulation or Cover Image) */}
      <div className="relative h-24 bg-kanri-bg w-full">
        {coverImage && (
          <Image
            src={coverImage}
            alt="Cover"
            layout="fill"
            objectFit="cover"
          />
        )}
        {/* Overlay gradient to darken top for tags */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        
        {/* Tags */}
        <div className="absolute top-4 left-4 flex gap-2">
          {tags.map((tag, idx) => (
            <Tag key={idx} variant={tag.variant}>
              {tag.label}
            </Tag>
          ))}
        </div>

        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-brand-primary p-2 rounded-full shadow-sm transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {/* Curved white overlay effect - using simple rounded bottom */}
        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-kanri-surface rounded-t-[24px]"></div>
      </div>

      <div className="flex flex-col p-5 pt-0 z-10 flex-grow">
        {/* Date Range */}
        <div className="flex items-center gap-1.5 text-brand-secondary text-xs font-medium mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{dateRange}</span>
        </div>

        {/* Title */}
        <h3 className="text-brand-primary text-[17px] font-bold mb-5 line-clamp-2">
          {title}
        </h3>

        {/* Student Grid */}
        <div className="grid grid-cols-4 gap-3 mt-auto">
          {visibleStudents.map((student, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative mb-2 w-full pt-[100%] rounded-[14px] overflow-hidden">
                 {student.avatar ? (
                    <Image src={student.avatar} layout="fill" objectFit="cover" alt={student.name} />
                 ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                 )}
                 {/* Badges */}
                 {student.roleBadge && (
                    <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                      student.roleBadge === 'S' ? 'bg-yellow-400' :
                      student.roleBadge === 'A' ? 'bg-red-500' :
                      student.roleBadge === 'B' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {student.roleBadge}
                    </div>
                 )}
                 {student.isLeader && (
                    <div className="absolute bottom-1 left-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-brand-primary">
                       <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                 )}
                 {student.countBadge && (
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                       +{student.countBadge}
                    </div>
                 )}
              </div>
              <div className="text-center w-full">
                <p className="text-[10px] font-bold text-brand-primary truncate w-full">{student.name}</p>
                <p className="text-[9px] text-brand-secondary truncate w-full mt-0.5">{student.katakana}</p>
                <p className="text-[9px] text-brand-secondary/70 truncate w-full">{student.studentId}</p>
              </div>
            </div>
          ))}

          {/* Empty Slots */}
          {Array.from({ length: emptySlots }).map((_, idx) => (
            <div key={`empty-${idx}`} className="flex flex-col items-center">
              <button className="w-full pt-[100%] rounded-[14px] border border-dashed border-gray-300 relative hover:bg-gray-50 hover:border-gray-400 transition-colors group">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:text-gray-500">
                    <Plus className="w-6 h-6" />
                 </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
