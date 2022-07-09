import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./ToolbarButton.scss";

export const presets = [
  "basic",
  "transparent",
  "accept",
  "cancel",
  "accent1",
  "accent2",
  "accent3",
  "accent4",
  "accent5",
  "accent7",
  "accent8"
];

export const types = ["none", "left", "middle", "right"];

export const statusColors = ["recording", "unread", "enabled", "disabled"];

export const ToolbarButton = forwardRef(
  (
    {
      preset,
      className,
      iconContainerClassName,
      children,
      icon,
      label,
      selected,
      large,
      statusColor,
      type,
      darkTextColor,
      centerIcon,
      imageIcon,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.toolbarButton,
          styles[preset],
          styles[type],
          { [styles.selected]: selected, [styles.large]: large },
          className
        )}
        {...rest}
      >
        {imageIcon ? (
          <div
            className={classNames(styles.iconContainer, iconContainerClassName)}
            style={{ backgroundImage: `url(${imageIcon})`, backgroundSize: "100% 100%" }}
            aria-hidden="true"
          />
        ) : (
          <div className={classNames(styles.iconContainer, iconContainerClassName)} aria-hidden="true">
            {icon}
            {statusColor && <div className={classNames(styles.statusIndicator, styles["status-" + statusColor])} />}
            {children}
          </div>
        )}
        {label && <label>{label}</label>}
        {/*<div className={classNames(styles.iconContainer, iconContainerClassName)} aria-hidden="true">*/}
        {/*  <span style={centerIcon ? null : { marginTop: -8 }}>{icon}</span>*/}
        {/*  {statusColor && <div className={classNames(styles.statusIndicator, styles["status-" + statusColor])} />}*/}
        {/*  {children}*/}
        {/*</div>*/}
        {/*{label && (*/}
        {/*  <label*/}
        {/*    style={{*/}
        {/*      ...{ fontSize: 12, transform: "scale(0.83)", marginTop: -16 },*/}
        {/*      ...(darkTextColor || selected ? null : { color: "#F9F9F9" })*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {label}*/}
        {/*  </label>*/}
        {/*)}*/}
      </button>
    );
  }
);

ToolbarButton.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.node,
  selected: PropTypes.bool,
  preset: PropTypes.oneOf(presets),
  statusColor: PropTypes.oneOf(statusColors),
  large: PropTypes.bool,
  className: PropTypes.string,
  iconContainerClassName: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(types),
  darkTextColor: PropTypes.bool,
  centerIcon: PropTypes.bool
};

ToolbarButton.defaultProps = {
  preset: "basic"
};
