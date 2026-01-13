import React from 'react'
import classes from './StatusChip.module.css'

export default function StatusChip({ children, icon, bgColor }) {
  const chipStyle = bgColor ? { background: bgColor, border: '1px solid var(--lavender-gray)' } : {};
  const textStyle = bgColor ? { color: '#222227' } : {};
  
  return (
    <div className={classes.chip} style={chipStyle}>
      {icon && <span className={classes.icon}>{icon}</span>}
      <span className={classes.text} style={textStyle}>{children}</span>
    </div>
  )
}