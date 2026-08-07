import React, { forwardRef } from "react";

const BaseInput = forwardRef(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      disabled,
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
          {leftIcon && (
            <div className="absolute left-3 text-brand-secondary pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={`w-full bg-kanri-surface border rounded-lg px-3 py-2.5 text-sm text-brand-primary placeholder:text-brand-secondary/70 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-kanri-border-focus transition-colors ${
              disabled ? "bg-kanri-bg text-brand-secondary cursor-not-allowed" : ""
            } ${error ? "border-status-recording focus:border-status-recording focus:ring-status-recording/30" : "border-kanri-border"} ${
              leftIcon ? "pl-10" : ""
            } ${rightIcon ? "pr-10" : ""} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-brand-secondary">
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
