import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import "./Link.css";

export const Link = ({
  to,
  label,
  color = "#bd9a31",
  buttonStyle = 'transparent',
  fontSize = '14px',
  style = {},
  children,
  className = "",
}) => {
  const linkClassName = buttonStyle
    ? `link-button link-button-${buttonStyle} ${className}`
    : `link ${className}`;

  return (
    <RouterLink
      to={to}
      className={linkClassName}
      style={{ color, fontSize, ...style }}
    >
      {children ? <span className="link-icon">{children}</span> : ""}
      <span className="link-text">{label}</span>
    </RouterLink>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string,
  buttonStyle: PropTypes.oneOf(["default", "primary", "transparent"]),
  style: PropTypes.object,
  children: PropTypes.node,
  className: PropTypes.string,
};
