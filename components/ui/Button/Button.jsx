import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand-primary text-white hover:bg-opacity-90 focus:ring-brand-primary border border-transparent",
    secondary:
      "bg-kanri-surface text-brand-primary border border-kanri-border hover:bg-kanri-bg focus:ring-brand-primary",
    outline:
      "bg-kanri-surface text-brand-primary border border-brand-primary hover:bg-kanri-bg focus:ring-brand-primary",
    ghost:
      "bg-transparent text-brand-primary hover:bg-kanri-bg focus:ring-brand-primary border border-transparent",
    icon: "bg-transparent text-brand-secondary hover:bg-kanri-bg focus:ring-kanri-border border border-transparent",
    "auth-outline":
      "bg-transparent text-white border border-white hover:bg-white hover:text-brand-primary focus:ring-white", // As per assumption for auth
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
    icon: "p-2 rounded-full",
  };

  const classes = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[variant === "icon" ? "icon" : size] || sizes.md}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
