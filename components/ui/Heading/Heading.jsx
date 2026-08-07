import React from "react";

const Heading = ({
  children,
  level = 2,
  size = "md",
  className = "",
  ...props
}) => {
  const Tag = `h${level}`;

  const sizes = {
    xl: "text-2xl font-bold tracking-tight text-brand-primary",
    lg: "text-xl font-semibold text-brand-primary",
    md: "text-base font-semibold text-brand-primary",
    sm: "text-sm font-medium text-brand-secondary",
  };

  const classes = `${sizes[size]} ${className}`.trim();

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;
