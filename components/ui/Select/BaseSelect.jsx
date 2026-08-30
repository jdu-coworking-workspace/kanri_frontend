import React, { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useIntl } from "react-intl";

const BaseSelect = forwardRef(
  (
    {
      label,
      labelPosition = "top",
      options = [],
      value,
      onChange,
      error,
      variant = "default", // "default" yoki "modal"
      className = "",
      containerClassName = "",
      disabled = false,
      placeholder = "選ぶ...",
      name,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const intl = useIntl();

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
      if (disabled) return;
      if (onChange) {
        onChange({ target: { name, value: optionValue } });
      }
      setIsOpen(false);
    };

    const labelLayoutClasses = {
      top: "flex-col gap-1.5",
      left: "flex-row items-center gap-1",
      right: "flex-row-reverse items-center gap-1",
    };

    const variantClasses = {
      default: "bg-kanri-surface border-kanri-border text-brand-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white",
      modal: "bg-[#F5F8FA] border-[#E4E9EE] text-[#122B31] dark:bg-gray-800 dark:border-gray-700 dark:text-white",
    };

    return (
      <div className={`flex ${labelLayoutClasses[labelPosition] || "flex-col gap-1.5"} ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-[#122B31] dark:text-gray-200 whitespace-nowrap">
            {intl.formatMessage({ id: label })}
          </label>
        )}

        <div className="relative w-full" ref={dropdownRef}>
          <div
            ref={ref}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between border rounded-xl px-3.5 py-2.5 text-sm cursor-pointer transition-all ${variantClasses[variant] || variantClasses.default
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${error ? "border-status-recording ring-1 ring-status-recording" : ""
              } ${className}`}
          >
            <span className={!selectedOption ? "text-[#8897AD] dark:text-gray-400" : "text-[#122B31] dark:text-white"}>
              {selectedOption ? selectedOption.label : intl.formatMessage({ id: placeholder })}
            </span>

            <ChevronDown
              className={`w-4 h-4 text-[#8897AD] dark:text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"
                }`}
            />
          </div>

          {isOpen && !disabled && (
            <ul className="absolute z-50 w-full mt-1 max-h-80 overflow-auto no-scrollbar bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 text-sm transition-all">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3.5 py-2.5 cursor-pointer transition-colors ${isSelected
                      ? "bg-gray-100 dark:bg-gray-700 font-medium text-black dark:text-white"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200"
                      }`}
                  >
                    {opt.label}
                  </li>
                );
              })}
            </ul>
          )}

          {error && <span className="text-xs text-status-recording mt-1 block">{error}</span>}
        </div>
      </div>
    );
  }
);

BaseSelect.displayName = "BaseSelect";

export default BaseSelect;