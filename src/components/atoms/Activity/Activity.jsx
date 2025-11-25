import React from 'react'
import { CiCircleCheck } from "react-icons/ci"
import classes from './Activity.module.css'

export default function Activity({ text, date, isLast }) {
  return (
    <div className={classes.activityContainer}>
      <div className={classes.iconWrapper}>
        <CiCircleCheck className={classes.icon} />
        {!isLast && <div className={classes.verticalLine}></div>}
      </div>
      <div className={classes.contentWrapper}>
        <p className={classes.text}>{text}</p>
        <span className={classes.date}>{date}</span>
      </div>
    </div>
  )
}
