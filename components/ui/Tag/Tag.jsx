import React from "react";

const Tag = ({ children, variant = "trial", className = "", ...props }) => {
  const variants = {
    trial: "bg-tag-trial text-white",
    it: "bg-[#0088FF] text-white",
    video: "bg-[#8B5CF6] text-white",
    light_work: "bg-[#F59E0B] text-white",
    planned: "bg-[#3B82F6] text-white",
    active: "bg-tag-active text-white",
    complete: "bg-gray-700 text-white dark:bg-gray-700 dark:text-gray-100",
    done: "bg-gray-700 text-white dark:bg-gray-700 dark:text-gray-100",
  };

  const baseClasses =
    "inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full shadow-sm transition-colors duration-300";
  const classes = `${baseClasses} ${variants[variant] || variants.trial} ${className}`.trim();

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Tag;
