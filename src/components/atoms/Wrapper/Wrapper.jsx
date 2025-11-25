import React from "react";
import classes from "./Wrapper.module.css";

const Wrapper = ({ children, title = "", className = "" }) => {
  return (
    <div className={classes.wrapperContainer}>
    <div className={`${classes.wrapper} ${className}`}>
      <div className={classes.header}>
        <h4>{title}</h4>
      </div>
      <div className={classes.content}>{children}</div>
    </div>
    </div>
  );
};

export default Wrapper;
