import React from "react";

const Tag = ({ children, variant = "trial", className = "", ...props }) => {
  const variants = {
    trial: "bg-tag-trial text-tag-trial-text",
    active: "bg-tag-active text-tag-active-text",
    complete: "bg-tag-complete text-tag-complete-text",
  };

  const baseClasses =
    "inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full";
  const classes = `${baseClasses} ${variants[variant] || variants.trial} ${className}`.trim();

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Tag;
