import React from 'react'
import classes from './ProgressBarCircular.module.css'
import { FaCheckCircle } from "react-icons/fa";

export default function ProgressBarCircular({ percentage = 0, size = 80 }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={classes.container} style={{ width: size, height: size }}>
      <svg className={classes.svg} width={size} height={size}>
        <circle
          className={classes.circleBg}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="6"
        />
        <circle
          className={classes.circleProgress}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={classes.percentage}>{percentage == 100 ? <FaCheckCircle color={'var(--primary-base)'} size={26}/> : `${percentage}%`}</div>
    </div>
  )
}
