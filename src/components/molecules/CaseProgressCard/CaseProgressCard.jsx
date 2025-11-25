import React from 'react'
import classes from './CaseProgressCard.module.css'
import { PiUserCircleFill } from "react-icons/pi";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { BsPatchCheck } from "react-icons/bs";
import { RiKeyFill } from "react-icons/ri";
import { LuExternalLink } from "react-icons/lu";
import ProgressBarCircular from '@/components/atoms/ProgressBarCircular/ProgressBarCircular'
import StatusChip from '@/components/atoms/StatusChip/StatusChip'

export default function CaseProgressCard({
  tabLabel = "EU TM OPPO",
  userName = "Darlene Steuber",
  progress = 80,
  status = "Decision",
  trademarkName = "Crist and Sons",
  trademarkNo = "R-3526",
  referenceLink = "#"
}) {
  return (
    <div className={classes.wrapper}>
      {/* Tab Section - Outside the card */}
      <div className={classes.activeTab}>{tabLabel}</div>
      
      {/* Card */}
      <div className={classes.card}>
        {/* Card Content */}
        <div className={classes.cardContent}>
        {/* User Info Row */}
        <div className={classes.userRow}>
          <div className={classes.userInfo}>
            <PiUserCircleFill className={classes.userIcon} />
            <div className={classes.userName}>{userName}</div>
          </div>
          <ProgressBarCircular percentage={progress} size={80} />
        </div>

        {/* Status Row */}
        <div className={classes.statusRow}>
          <MdOutlineChecklistRtl className={classes.statusIcon} />
          <StatusChip>{status}</StatusChip>
        </div>

        {/* Trademark Name */}
        <div className={classes.infoRow}>
          <BsPatchCheck className={classes.infoIcon} />
          <span className={classes.infoLabel}>Trademark Name - <strong>{trademarkName}</strong></span>
        </div>

        {/* Trademark Number */}
        <div className={classes.infoRow}>
          <BsPatchCheck className={classes.infoIcon} />
          <span className={classes.infoLabel}>Trademark No. - <strong>{trademarkNo}</strong></span>
        </div>

        {/* Reference Link */}
        <div className={classes.infoRow}>
          <RiKeyFill className={classes.infoIcon} />
          <a href={referenceLink} className={classes.referenceLink} target="_blank" rel="noopener noreferrer">
            Reference
            <LuExternalLink className={classes.externalIcon} />
          </a>
        </div>
        </div>
      </div>
    </div>
  )
}
