import React from 'react'
import classes from './Status.module.css'

const labelVariantMap = {
  'file observations': 'primary',
  'file invalidation': 'danger',
  'defense': 'teal',
  'second observations': 'turquoise',
  'cooling-off period': 'orange',
  'negotiations': 'lime',
  'prepare draft': 'lightBlue1',
  'prepare evidence': 'lightBlue2',
  'check evidence': 'lightBlue3',
  'client confirmation': 'lightBlue4',
  'submit': 'blue1',
  'track': 'blue2',
  'active': 'success',
  'in-active': 'secondary',
  'inactive': 'secondary',
}

export default function Status({ label, variant }) {
  // Auto-detect variant from label if not provided
  const detectedVariant = variant || labelVariantMap[label?.toLowerCase()] || 'primary'
  
  return (
    <div className={`${classes.status} ${classes[detectedVariant]}`}>
      {label}
    </div>
  )
}
