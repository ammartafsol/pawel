"use client";
import React from "react";
import PropTypes from "prop-types";
import classes from "./Wrapper.module.css";
import Input from "../Input/Input";
import { IoSearchSharp } from "react-icons/io5";
import StatusChip from "../StatusChip/StatusChip";
import Status from "../Status/Status";

const Wrapper = ({ 
  children,
  status,
  setValue = () => {},
  searchValue,
  contentClassName,
  searchPlaceholder = "",
  title = "",
  className = "",
  headerComponent = null,
}) => {
  return (
    <div className={classes.wrapperContainer}>
      <div className={`${classes.wrapper} ${className}`}>
        <div className={classes.header}>
          {(title || searchPlaceholder || status) && (
            <div className={classes.headerTop}>
              {title && <h4>{title}</h4>}
              {searchPlaceholder && (
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  leftIcon={<IoSearchSharp size={20} />}
                  inputClass={classes.searchInput}
                  setValue={setValue}
                  value={searchValue}
                />
              )}
              {status && (
                <div>
                  <Status status={status} />
                </div>
              )}
            </div>
          )}
          {headerComponent && (
            <div className={classes.headerComponent}>
              {headerComponent}
            </div>
          )}
        </div>

        <div className={`${classes.content} ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  searchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setValue: PropTypes.func,
  status: PropTypes.string,
  headerComponent: PropTypes.node,
};

export default Wrapper;
