import React, { forwardRef, useState, useRef, useEffect } from "react";
import BaseInput from "./BaseInput";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useIntl } from "react-intl";

const formatDateStr = (date) => {
  if (!date || isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
};

const parseDateStr = (str) => {
  if (!str) return null;
  const normalized = str.replace(/\//g, "-");
  const parts = normalized.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && y > 1900 && y < 2100 && m >= 0 && m < 12 && d >= 1 && d <= 31) {
      const dt = new Date(y, m, d);
      if (!isNaN(dt.getTime())) return dt;
    }
  }
  return null;
};

const getLocalizedWeekdays = (localeStr) => {
  const loc = localeStr === 'jp' ? 'ja-JP' : (localeStr || 'en-US');
  const weekdays = [];
  // 2026-03-01 is a Sunday
  const sunday = new Date(2026, 2, 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const name = new Intl.DateTimeFormat(loc, { weekday: 'short' }).format(d);
    weekdays.push(name);
  }
  return weekdays;
};

const generateCalendarDays = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days = [];

  // Padding from previous month
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const dateObj = new Date(year, month - 1, dayNum);
    days.push({
      date: dateObj,
      isCurrentMonth: false,
      dayNumber: dayNum,
    });
  }

  // Days of current month
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d);
    days.push({
      date: dateObj,
      isCurrentMonth: true,
      dayNumber: d,
    });
  }

  // Padding for next month to complete 35 or 42 grid cells
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    const dateObj = new Date(year, month + 1, n);
    days.push({
      date: dateObj,
      isCurrentMonth: false,
      dayNumber: n,
    });
  }

  return days;
};

const DateInput = forwardRef(
  (
    {
      value = "",
      onChange,
      name,
      label,
      placeholder = "YYYY/MM/DD",
      variant = "modal",
      error,
      className = "",
      containerClassName = "",
      disabled = false,
      popupPosition = "auto", // "auto", "top", "bottom", "overlay"
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [calcPosition, setCalcPosition] = useState(popupPosition);
    const containerRef = useRef(null);
    const intl = useIntl();

    const selectedDate = parseDateStr(value);
    const [viewingMonth, setViewingMonth] = useState(() => selectedDate || new Date());

    useEffect(() => {
      if (selectedDate) {
        setViewingMonth(selectedDate);
      }
    }, [value]);

    useEffect(() => {
      if (isOpen && containerRef.current) {
        if (popupPosition && popupPosition !== "auto") {
          setCalcPosition(popupPosition);
          return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const calendarHeight = 310;
        const viewportHeight = window.innerHeight;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow >= calendarHeight + 10) {
          setCalcPosition("bottom");
        } else if (spaceAbove >= calendarHeight + 10) {
          setCalcPosition("top");
        } else {
          setCalcPosition("overlay");
        }
      }
    }, [isOpen, popupPosition]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectDay = (dateObj) => {
      if (disabled) return;
      const formatted = formatDateStr(dateObj);
      if (onChange) {
        onChange({ target: { name, value: formatted } });
      }
      setIsOpen(false);
    };

    const handlePrevMonth = (e) => {
      e.stopPropagation();
      setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
      e.stopPropagation();
      setViewingMonth(new Date(viewingMonth.getFullYear(), viewingMonth.getMonth() + 1, 1));
    };

    const handleClear = (e) => {
      e.stopPropagation();
      if (onChange) {
        onChange({ target: { name, value: "" } });
      }
      setIsOpen(false);
    };

    const handleSelectToday = (e) => {
      e.stopPropagation();
      const today = new Date();
      const formatted = formatDateStr(today);
      if (onChange) {
        onChange({ target: { name, value: formatted } });
      }
      setViewingMonth(today);
      setIsOpen(false);
    };

    const weekdays = getLocalizedWeekdays(intl.locale);
    const daysGrid = generateCalendarDays(viewingMonth);
    const todayStr = formatDateStr(new Date());

    const monthYearTitle = new Intl.DateTimeFormat(
      intl.locale === 'jp' ? 'ja-JP' : (intl.locale || 'en-US'),
      { year: 'numeric', month: 'long' }
    ).format(viewingMonth);

    const positionClasses = {
      bottom: "top-full mt-1.5 right-0",
      top: "bottom-full mb-1.5 right-0",
      overlay: "top-1/2 -translate-y-1/2 right-0 shadow-2xl ring-1 ring-black/10 dark:ring-white/10",
    }[calcPosition || "bottom"];

    return (
      <div className={`relative w-full ${containerClassName}`} ref={containerRef}>
        <BaseInput
          ref={ref}
          name={name}
          label={label}
          placeholder={placeholder}
          variant={variant}
          value={value}
          onChange={onChange}
          error={error}
          disabled={disabled}
          rightIcon={
            <Calendar
              className="w-4 h-4 text-[#8897AD] hover:text-[#122B31] dark:hover:text-white cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) setIsOpen((prev) => !prev);
              }}
            />
          }
          className={className}
          {...props}
        />

        {isOpen && (
          <div className={`absolute z-50 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[20px] shadow-2xl w-[290px] text-sm text-[#122B31] dark:text-gray-100 animate-in fade-in zoom-in-95 duration-150 select-none ${positionClasses}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-gray-800 dark:text-gray-100">
                {monthYearTitle}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
              {weekdays.map((wd, idx) => (
                <div key={idx} className="py-1">
                  {wd}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysGrid.map((dayItem, idx) => {
                const dateFormatted = formatDateStr(dayItem.date);
                const isSelected = value === dateFormatted;
                const isToday = todayStr === dateFormatted;

                let cellClass = "w-8 h-8 flex items-center justify-center text-xs rounded-xl font-medium transition-all mx-auto cursor-pointer ";

                if (isSelected) {
                  cellClass += "bg-[#122B31] dark:bg-white text-white dark:text-gray-900 font-bold shadow-sm ";
                } else if (isToday) {
                  cellClass += "border border-[#122B31] dark:border-white text-[#122B31] dark:text-white font-bold ";
                } else if (dayItem.isCurrentMonth) {
                  cellClass += "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ";
                } else {
                  cellClass += "text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 ";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectDay(dayItem.date)}
                    className={cellClass}
                  >
                    {dayItem.dayNumber}
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 text-xs font-medium">
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-red-500 transition-colors px-1 py-0.5"
              >
                {intl.formatMessage({ id: '削除' }) || 'Clear'}
              </button>
              <button
                type="button"
                onClick={handleSelectToday}
                className="text-[#122B31] dark:text-gray-200 hover:underline font-semibold px-1 py-0.5"
              >
                {intl.formatMessage({ id: '現在' }) || 'Today'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
