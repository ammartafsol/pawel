import React from 'react';
import classes from "./IconInput.module.css"

const IconInput = ({ icon, title, children ,className}) => {
  return (
    <div className={`${classes.iconInput} ${className}`}>
        <div className={classes.iconInputTitle}>
            <div>
            <div className={classes.iconInputIcon}>
            {icon}
            </div>
            </div>
            <p>{title}</p>
        </div>
        <div>
            {children}
        </div>
    </div>
  )
}

export default IconInput