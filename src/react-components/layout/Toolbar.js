import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./Toolbar.scss";
import styleUtils from "../styles/style-utils.scss";

export function Toolbar({ className, left, center, right, ...rest }) {
  return (
    <div
      className={classNames(styles.toolbar, className)}
      {...rest}
      style={left.props.entered ? {} : { display: "none" }}
    >
      <div className={classNames(styles.content, styles.leftContent, styleUtils.showLg)} />
      <div className={styles.centerContentInner}>
        <div className={classNames(styles.content, styles.centerContent)}>{center}</div>
      </div>
      <div className={classNames(styles.content, styles.rightContent, styleUtils.showLg)} />
    </div>
  );
}

Toolbar.propTypes = {
  className: PropTypes.string,
  left: PropTypes.node,
  center: PropTypes.node,
  right: PropTypes.node,
  hideLeft: PropTypes.string,
  hideRight: PropTypes.string
};
