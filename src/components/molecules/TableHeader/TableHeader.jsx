import React from "react";
import classes from "./TableHeader.module.css";

const TableHeader = ({ title }) => {
  return (
    <>
      <div className={classes?.tableHeaderDrop}>
        <h4>{title}</h4>
      </div>
    </>
  );
};

export default TableHeader;
