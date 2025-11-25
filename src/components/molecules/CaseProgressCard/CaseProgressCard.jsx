"use client";
import React from 'react'
import classes from './CaseProgressCard.module.css'
import { PiUserCircleFill } from "react-icons/pi";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { BsPatchCheck } from "react-icons/bs";
import { RiKeyFill } from "react-icons/ri";
import { LuExternalLink } from "react-icons/lu";
import ProgressBarCircular from '@/components/atoms/ProgressBarCircular/ProgressBarCircular'
import StatusChip from '@/components/atoms/StatusChip/StatusChip'
import { useRouter } from 'next/navigation';

export default function CaseProgressCard({
  routePath,
  data={
    tabLabel: "",
    userName: "",
    progress: 0,
    status: "",
    trademarkName: "",
    trademarkNo: "",
    referenceLink: "",
  }
}) {
  const router = useRouter();
  return (
    <div  className={classes.wrapper} onClick={()=>{router.push(routePath)}}>
      {/* Tab Section - Outside the card */}
      <div className={classes.activeTab}>{data.tabLabel}</div>
      
      {/* Card */}
      <div className={classes.card}>
        {/* Card Content */}
        <div className={classes.cardContent}>
        {/* User Info Row */}
        <div className={classes.userRow}>
          <div className={classes.userInfo}>
            <PiUserCircleFill className={classes.userIcon} />
            <div className={classes.userName}>{data.userName}</div>
          </div>
          <ProgressBarCircular percentage={data.progress} size={80} />
        </div>

        {/* Status Row */}
        <div className={classes.statusRow}>
          <MdOutlineChecklistRtl className={classes.statusIcon} />
          <StatusChip>{data.status}</StatusChip>
        </div>  

        {/* Trademark Name */}
        <div className={classes.infoRow}>
          <BsPatchCheck className={classes.infoIcon} />
          <span className={classes.infoLabel}>Trademark Name - <strong>{data.trademarkName}</strong></span>
        </div>

        {/* Trademark Number */}
        <div className={classes.infoRow}>
          <BsPatchCheck className={classes.infoIcon} />
          <span className={classes.infoLabel}>Trademark No. - <strong>{data.trademarkNo}</strong></span>
        </div>

        {/* Reference Link */}
        <div className={classes.infoRow}>
          <RiKeyFill className={classes.infoIcon} />
          <a href={data.referenceLink} className={classes.referenceLink} target="_blank" rel="noopener noreferrer">
            Reference
            <LuExternalLink className={classes.externalIcon} />
          </a>
        </div>
        </div>
      </div>
    </div>
  )
}
