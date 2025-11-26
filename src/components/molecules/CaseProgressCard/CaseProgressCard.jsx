"use client";
import React from "react";
import classes from "./CaseProgressCard.module.css";
import { PiUserCircleFill } from "react-icons/pi";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { BsPatchCheck } from "react-icons/bs";
import { RiKeyFill } from "react-icons/ri";
import { LuExternalLink } from "react-icons/lu";
import ProgressBarCircular from "@/components/atoms/ProgressBarCircular/ProgressBarCircular";
import StatusChip from "@/components/atoms/StatusChip/StatusChip";
import { useRouter } from "next/navigation";
import { LuSquareUser } from "react-icons/lu";
import { VscTypeHierarchySub } from "react-icons/vsc";

export default function CaseProgressCard({
  routePath,
  isAssignedStaffVariant = false,
  isStatusVariant = false,
  data = {
    tabLabel: "",
    userName: "",
    progress: 0,
    status: "",
    trademarkName: "",
    trademarkNo: "",
    referenceLink: "",
    primaryStaff: "",
    secondaryStaff: "",
    jurisdiction: ""
  },
}) {
  const router = useRouter();
  return (
    <div
      className={classes.wrapper}
      onClick={() => {
        router.push(routePath);
      }}
    >
      {/* Tab Section - Outside the card */}
      <div className={classes.activeTab}>{data.tabLabel}</div>

      {/* Card */}
      <div className={classes.card}>
        {/* Card Content */}
        <div className={classes.cardContent}>
          {/* User Info Row */}
          {isAssignedStaffVariant ? (
            <div className={classes.userRowAssigned}>
              <div className={classes.staffInfo}>
                <div className={classes.userInfo}>
                  <LuSquareUser className={classes.userIcon} />
                  <div className={classes.assignedHeading}>Assigned Staff</div>
                </div>
                <div className={classes.keyValueDiv}>
                  <span className={classes.keyLabel}>Primary:</span>
                  <p className={classes.staffName}>{data?.primaryStaff}</p>
                </div>
                <div className={classes.keyValueDiv}>
                  <span className={classes.keyLabel}>Secondary:</span>
                  <p className={classes.staffName}>{data?.secondaryStaff}</p>
                </div>
              </div>
              <ProgressBarCircular percentage={data.progress} size={80} />
            </div>
          ) : (
            <div className={classes.userRow}>
              <div className={classes.userInfo}>
                <PiUserCircleFill className={classes.userIcon} />
                <div className={classes.userName}>{data.userName}</div>
              </div>
              <ProgressBarCircular percentage={data.progress} size={80} />
            </div>
          )}

          {/* Status Row */}
          <div className={classes.statusRow}>
            <MdOutlineChecklistRtl className={classes.statusIcon} />
            <StatusChip>{data.status}</StatusChip>
          </div>

          {/* Trademark Name */}
          <div className={classes.infoRow}>
            <BsPatchCheck className={classes.infoIcon} />
            <span className={classes.infoLabel}>
              Trademark Name - <strong>{data.trademarkName}</strong>
            </span>
          </div>

          {/* Trademark Number */}
          <div className={classes.infoRow}>
            <BsPatchCheck className={classes.infoIcon} />
            <span className={classes.infoLabel}>
              Trademark No. - <strong>{data.trademarkNo}</strong>
            </span>
          </div>

           {/* Jurisdiction */}
            <div className={classes.infoRow}>
            <VscTypeHierarchySub className={classes.infoIcon} />
            <span className={classes.infoLabel}>
              Jurisdiction - <strong>{data.jurisdiction}</strong>
            </span>
          </div>

          {/* Reference Link */}
          <div className={classes.infoRow}>
            <RiKeyFill className={classes.infoIcon} />
            <a
              href={data.referenceLink}
              className={classes.referenceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reference
              <LuExternalLink className={classes.externalIcon} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
