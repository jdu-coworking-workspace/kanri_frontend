import React, { forwardRef } from "react";

const BaseInput = forwardRef(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      variant = "default", // "default" yoki "modal"
      className = "",
      containerClassName = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-kanri-surface border-kanri-border text-brand-primary dark:bg-gray-800 dark:border-gray-700",
      modal: "bg-[#F5F8FA] border-[#E4E9EE] text-[#122B31] focus:bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white",
    };

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-[#122B31] dark:text-gray-200">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#8897AD] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`w-full border rounded-xl px-3.5 py-2.5 text-sm placeholder:text-[#8897AD] focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all ${variantClasses[variant] || variantClasses.default
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""
              } ${error ? "border-status-recording ring-1 ring-status-recording" : ""
              } ${leftIcon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#8897AD] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-status-recording">{error}</span>}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";

export default BaseInput;