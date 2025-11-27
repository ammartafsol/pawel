import React from "react";
import classes from "./GridFilter.module.css";
import { LuTable } from "react-icons/lu";
import { MdGridView } from "react-icons/md";

const GridFilter = ({ gridFilter, activeGridFilter, setActiveGridFilter, classesName }) => {
  return (
    <div className={`${classes.gridFilter} ${classesName}`}>
      {gridFilter.map((item) => (
        <div 
          key={item.value}
          onClick={() => setActiveGridFilter(item)} 
          className={`${classes.gridFilterContent} ${activeGridFilter.value === item.value ? classes.active : ""}`}
        >
          <span>{item.label}</span>
          <div className={classes.icon}>{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default GridFilter;
