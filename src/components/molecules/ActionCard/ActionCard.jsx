import React from 'react'
import Image from 'next/image'
import classes from './ActionCard.module.css'

// Map labels to image names
const getImageFromLabel = (label) => {
  if (!label) return null
  
  const normalizedLabel = label.toLowerCase().trim()
  
  const labelToImageMap = {
    'create new case': 'createCase',
    'add a document': 'addDoc',
    'export audit logs': 'exportAuditLogs',
    'export data': 'exportData',
  }
  
  return labelToImageMap[normalizedLabel] || null
}

export default function ActionCard({ image, text, label, onClick, title, description }) {
  // Use image prop if provided, otherwise auto-detect from label/text
  const imageName = image || getImageFromLabel(label || text)
  
  if (!imageName) {
    console.warn('ActionCard: Image name could not be determined. Please provide either "image" prop or a recognized "label"/"text".')
  }
  
  
  return (
    <div className={classes.card} onClick={onClick}>
      <div className={classes.iconContainer}>
        {imageName && (
          <Image
            src={image}
            alt={title}
            width={48}
            height={48}
            className={classes.icon}
          />
        )}
      </div>
      <span className={classes.text}>{title}</span>
    </div>
  )
}
