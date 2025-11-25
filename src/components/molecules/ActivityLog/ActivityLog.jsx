import React from 'react'
import Activity from '../../atoms/Activity/Activity'
import classes from './ActivityLog.module.css'

const DEFAULT_ACTIVITIES = [
  { text: "Status update to Defense", date: "May 1, 2025" },
  { text: "Status update to Evidence Round Opponent", date: "May 15, 2025" },
  { text: "Document Upload", date: "May 15, 2025" }
]

export default function ActivityLog({ activities = DEFAULT_ACTIVITIES }) {
  return (
    <div className={classes.activityLogContainer}>
      {activities.map((activity, index) => (
        <Activity
          key={index}
          text={activity.text}
          date={activity.date}
          isLast={index === activities.length - 1}
        />
      ))}
    </div>
  )
}
