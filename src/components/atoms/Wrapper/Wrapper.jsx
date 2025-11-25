import React from "react";
import PropTypes from "prop-types";
import classes from "./Wrapper.module.css";
import Input from "../Input/Input";
import { IoSearchSharp } from "react-icons/io5";

const Wrapper = ({ children,setValue=()=>{},searchValue ,searchPlaceholder="",title = "", className = "" }) => {
  return (
    <div className={classes.wrapperContainer}>
    <div className={`${classes.wrapper} ${className}`}>
      <div className={classes.header}>
        <h4>{title}</h4>
        {
          searchPlaceholder && (
            <Input 
              type="search" 
              placeholder={searchPlaceholder} 
              leftIcon={<IoSearchSharp size={20} />}
              inputClass={classes.searchInput}
              setValue={setValue}
              value={searchValue}
            />
          )
        }
      </div>

      <div className={classes.content}>{children}</div>
    </div>
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node,
  searchPlaceholder: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default Wrapper;
