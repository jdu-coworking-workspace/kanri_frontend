import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const BaseSelect = forwardRef(
  (
    {
      label,
      options = [],
      error,
      className = "",
      containerClassName = "",
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-brand-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none bg-kanri-surface border rounded-lg px-3 py-2.5 pr-10 text-sm text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-kanri-border-focus transition-colors ${
              disabled ? "bg-kanri-bg text-brand-secondary cursor-not-allowed" : ""
            } ${error ? "border-status-recording focus:border-status-recording focus:ring-status-recording/30" : "border-kanri-border"} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 text-brand-secondary pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <span className="text-xs text-status-recording">{error}</span>}
      </div>
    );
  }
);

BaseSelect.displayName = "BaseSelect";

export default BaseSelect;
