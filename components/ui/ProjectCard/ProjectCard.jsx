import React, { useState, useRef, useEffect } from "react";
import { Calendar, MoreHorizontal, Plus, Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Tag from "../Tag/Tag";
import Avatar from "../Avatar/Avatar";

const ProjectCard = ({
  title,
  tags = [],
  dateRange,
  students = [],
  maxVisibleStudents = 4,
  totalSlots = 8,
  onEdit,
  onDelete,
  onAddStudent,
  className = "",
  coverImage,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const visibleStudents = students.slice(0, maxVisibleStudents);
  const emptySlotsCount = Math.max(0, totalSlots - visibleStudents.length);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full select-none pt-[60px] ${className}`}>
      {/* 1. Cover Image */}
      <div className="absolute top-0 left-0 w-full h-[140px] rounded-t-[20px] overflow-hidden z-0 after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-black/20">
        {coverImage ? (
          <Image
            src={coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900" />
        )}
      </div>

      {/* 2. Top Tags */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
        {tags.map((tag, idx) => (
          <Tag key={idx} variant={tag.variant}>
            {tag.label}
          </Tag>
        ))}
      </div>

      {/* 3. Dropdown Menu */}
      <div className="absolute top-[60px] right-1 z-30" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-[38px] h-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-transform active:scale-95"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onEdit?.();
              }}
              className="w-full px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-500" />
              編集
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onDelete?.();
              }}
              className="w-full px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              削除
            </button>
          </div>
        )}
      </div>

      {/* 5. Kontent (SVG ichidagi bo'sh joyga to'g'rilangan pad bilan) */}
      <div
        className="bg-[url('/images/project-bg.png')] dark:bg-[url('/images/project-dark-bg.png')] bg-cover rounded-2xl w-full flex flex-col justify-between pointer-events-auto relative z-10 h-[271px]"
      >
        <div className="px-3 pt-3 pb-3">
          {/* Sana */}
          <div className="flex items-center gap-1.5 text-[#456272] dark:text-gray-400 text-xs font-medium mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateRange}</span>
          </div>

          {/* Sarlavha */}
          <h3 className="text-kanri-primary dark:text-white text-base font-bold line-clamp-1 mb-3">
            {title}
          </h3>

          {/* Studentlar ro'yxati */}
          <div className="grid grid-cols-4 gap-2">
            {visibleStudents.map((student, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Avatar
                  src={student.avatar}
                  alt={student.name}
                  size="lg"
                  status={student.status}
                  isLeader={student.isLeader}
                  groupCount={student.groupCount}
                  countryFlag={student.countryFlag}
                />
                <div className="text-center w-full mt-1">
                  <p className="text-[9px] font-bold text-[#122B31] dark:text-gray-200 leading-3">
                    {student.name}
                  </p>
                  <div className="w-full overflow-hidden whitespace-nowrap leading-3 h-4">
                    <p
                      className="inline-block text-[9px] text-[#5C6B82] dark:text-gray-400 "
                      style={{
                        animation: 'marquee 10s linear infinite',
                        display: 'inline-block',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <style>{`
                      @keyframes marquee {
                        0% { transform: translateX(100%); }
                        100% { transform: translateX(-100%); }
                      }
                    `}</style>
                      {student.katakana}
                    </p>
                  </div>
                  <p className="text-[8px] text-[#8897AD] dark:text-gray-500 truncate leading-tight">
                    {student.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty Slots (+) - 64x64px o'lchamda */}
        <div className="grid grid-cols-4 gap-2 px-3 pb-3">
          {Array.from({ length: emptySlotsCount }).map((_, idx) => (
            <button
              key={`empty-${idx}`}
              onClick={onAddStudent}
              className="h-[64px] shrink-0 rounded-[12px] border border-dashed border-[#D0D5DD] dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-[#98A2B3] dark:text-gray-400 transition-colors group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;