import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

export const Button = ({
  variant = "default",
  size = "md",
  backgroundColor,
  label,
  onClick = () => {},
  children,
  style,
  className,
  type = "button",
}) => {
  const mode = `button--${variant}`;

  const buttonClassName = [className, "button", `button--${size}`, mode]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClassName}
      style={{ backgroundColor, ...style }}
      onClick={onClick}
    >
      {children ? <span className="button-icon">{children}</span> : ""}
      {label}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf([
    "default",
    "danger",
    "primary",
    "secondary",
    "auth",
  ]),
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["2xs", "xs", "sm", "md", "lg", "full"]),
  label: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
  type: PropTypes.string,
};
