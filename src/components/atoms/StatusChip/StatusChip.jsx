import React from 'react'
import classes from './StatusChip.module.css'

export default function StatusChip({ children, icon }) {
  return (
    <div className={classes.chip}>
      {icon && <span className={classes.icon}>{icon}</span>}
      <span className={classes.text}>{children}</span>
    </div>
  )
}