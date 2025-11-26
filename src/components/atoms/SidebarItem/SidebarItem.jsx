import React from 'react';
import classes from "./SidebarItem.module.css"

const SidebarItem = ({icon, title}) => {
  return (
    <div className={classes?.sidebarItem}>
          {icon}
          <h5>{title}</h5>
        </div>
  )
}

export default SidebarItem