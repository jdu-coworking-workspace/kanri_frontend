import React from "react";

const Tag = ({ children, variant = "trial", className = "", ...props }) => {
  const variants = {
    trial: "bg-tag-trial",
    active: "bg-tag-active",
    complete: "bg-tag-complete",
  };

  const baseClasses =
    "inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full text-white dark:text-gray-900 transition-colors duration-300";
  const classes = `${baseClasses} ${variants[variant] || variants.trial} ${className}`.trim();

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Tag;
