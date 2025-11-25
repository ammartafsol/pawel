import React from 'react'
import Image from 'next/image'
import classes from './ActionCard.module.css'

export default function ActionCard({ image, text, onClick }) {
  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.iconContainer}>
        <Image
          src={`/app-images/${image}.png`}
          alt={text}
          width={48}
          height={48}
          className={classes.icon}
        />
      </div>
      <span className={classes.text}>{text}</span>
    </div>
  )
}
