import React from 'react'
import Image from 'next/image'
import { IoEyeOutline } from 'react-icons/io5'
import classes from './DocCard.module.css'

export default function DocCard({ 
  title = "Document 1", 
  dateTime = "12/29/2023 10:20",
  visibilityText = "Visible to client"
}) {
  return (
    <div className={classes.card}>
      <div className={classes.content}>
        <div className={classes.imageContainer}>
          <Image
            src="/app-images/doc.svg"
            alt="Document"
            width={58}
            height={52.241}
            className={classes.image}
          />
        </div>
        <div className={classes.details}>
          <h3 className={classes.title}>{title}</h3>
          <p className={classes.dateTime}>{dateTime}</p>
          <div className={classes.visibility}>
            <IoEyeOutline className={classes.eyeIcon} />
            <span className={classes.visibilityText}>{visibilityText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
