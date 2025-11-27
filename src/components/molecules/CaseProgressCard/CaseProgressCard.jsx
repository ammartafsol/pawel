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
import { mergeClass } from "@/resources/utils/helper";
import Status from "@/components/atoms/Status/Status";
import { BiCalendar } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { MdChecklistRtl } from "react-icons/md";

export default function CaseProgressCard({
  routePath,
  isAssignedStaffVariant = false,
  isStatusVariant = false,
  isCaseDetailVariant = false,
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
    jurisdiction: "",
    deadline: "",
    clientName: "",
    deadlines: [],
    tasks: [], 
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
      {(!isStatusVariant && !isCaseDetailVariant) && (
        <div className={classes.activeTab}>{data.tabLabel}</div>
      )}

      {/* Card */}
      <div
        className={mergeClass(
          classes.card,
          (isStatusVariant || isCaseDetailVariant) ? classes.isStatusVariantClass : ""
        )}
      >
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
          ) : isStatusVariant ? (
            <div className={classes.userRowAssigned}>
              <div className={classes.staffInfo}>
                <div className={classes.statusVariantLabel}>
                  <p>{data.tabLabel}</p>
                </div>
                <div className={classes.userInfo}>
                  <PiUserCircleFill className={classes.userIcon} />
                  <div className={classes.userName}>{data.userName}</div>
                </div>
              </div>
              <ProgressBarCircular percentage={data.progress} size={80} />
            </div>
          ) : isCaseDetailVariant ? (
             <div className={classes.userRowAssigned}>
              <div className={classes.staffInfo}>
                <div className={classes.statusVariantLabel}>
                  <p>{data.tabLabel}</p>
                </div>
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

          {
            isCaseDetailVariant && (
              <div className={classes.editDivider}>
                  <FiEdit className={classes.editIcon} size={18}/>
              </div>
            )
          }

          {/* Status Row */}
        {!isCaseDetailVariant &&  <div className={classes.statusRow}>
            <MdOutlineChecklistRtl className={classes.statusIcon} />
            {isStatusVariant ? (
              <Status label={data.status} />
            ) : (
              <StatusChip>{data.status}</StatusChip>
            )}
          </div>}

          {/* Trademark Name */}
          <div className={classes.infoRow}>
            <BsPatchCheck className={classes.infoIcon} />
            <span className={classes.infoLabel}>
              Trademark Name -{" "}
              <strong
                className={isStatusVariant ? classes.statusVariantUnderlined : ""}
              >
                {data.trademarkName}
              </strong>
            </span>
          </div>

          {/* Trademark Number */}
          <div className={classes.infoRow}>
            <BsPatchCheck className={classes.infoIcon} />
            <span className={classes.infoLabel}>
              Trademark No. -{" "}
              <strong
                className={isStatusVariant ? classes.statusVariantUnderlined : ""}
              >
                {data.trademarkNo}
              </strong>
            </span>
          </div>

          {/* Jurisdiction */}
          {(isAssignedStaffVariant || isCaseDetailVariant) && (
            <div className={classes.infoRow}>
              <VscTypeHierarchySub className={classes.infoIcon} />
              <span className={classes.infoLabel}>
                Jurisdiction - <strong>{data.jurisdiction}</strong>
              </span>
            </div>
          )}

          {/* Deadline */}
          {isStatusVariant && (
            <div className={classes.infoRow}>
              <BiCalendar className={classes.infoIcon} />
              <span className={classes.infoLabel}>
                Next Off. Deadline - <strong>{data.deadline}</strong>
              </span>
            </div>
          )}

          {/* Client Name */}
          {(isStatusVariant || isCaseDetailVariant) && (
            <div className={classes.infoRow}>
              <FaRegUser className={classes.infoIcon} />
              <span className={classes.infoLabel}>
                Client Name - <strong>{data.clientName}</strong>
              </span>
            </div>
          )}

          {/* Deadlines */}
          {isCaseDetailVariant && (
            <div className={classes.infoRowDetailed}>
              <BiCalendar className={mergeClass(classes.infoIcon, 'mt-1')} />
              <div className={classes.detailsDiv}>
                <span className={classes.infoLabel}>Deadlines</span>
                {((Array.isArray(data.deadlines) && data.deadlines.length > 0) 
                  ? data.deadlines 
                  : (data.deadline ? [{ label: "Deadline", value: data.deadline }] : [])
                ).map((dl, idx) => (
                  <span key={idx} className={mergeClass(classes.infoLabel, classes.infoLabelDetail)}>
                    {dl.label} - <strong>{dl.value}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {isCaseDetailVariant && (
            <div className={classes.infoRowDetailed}>
              <MdChecklistRtl className={mergeClass(classes.infoIcon, "mt-1")} />
              <div className={classes.detailsDiv}>
                <span className={classes.infoLabel}>Tasks</span>
                {(Array.isArray(data.tasks) && data.tasks.length > 0
                  ? data.tasks
                  : []
                ).map((task, idx) => (
                  <span
                    key={idx}
                    className={mergeClass(classes.infoLabel, classes.infoLabelDetail)}
                  >
                    {typeof task === "string"
                      ? task
                      : task?.label
                      ? `${task.label} - ${task.value ?? ""}`
                      : JSON.stringify(task)}
                  </span>
                ))}
              </div>
            </div>
          )}

                    {/* Reference Link */}
          {!isStatusVariant && (
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
          )}

        </div>
      </div>
    </div>
  );
}
