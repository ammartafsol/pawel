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
import { RiDeleteBinLine } from "react-icons/ri";
import { MdChecklistRtl } from "react-icons/md";
import Button from "@/components/atoms/Button";
import { RenderDateCell } from "@/components/organisms/ResponsiveTable/CommonCells";
import ReferenceTag from "@/components/atoms/ReferenceTag/ReferenceTag";


export default function CaseProgressCard({
  routePath,
  isAssignedStaffVariant = false,
  isStatusVariant = false,
  isCaseDetailVariant = false,
  referenceLink = "",
  onEditClick,
  showEditButton = false,
  onDeleteClick,
  showDeleteButton = false,
  data = {
    tabLabel: "",
    userName: "",
    progress: 0,
    status: "",
    phaseBgColor: null,
    phaseColor: null,
    trademarkName: "",
    trademarkNo: "",
    referenceLink: "",
    primaryStaff: "",
    secondaryStaff: "",
    jurisdiction: "",
    deadline: "",
    officeDeadline: "",
    internalDeadline: "",

    clientName: "",
    deadlines: [],
    tasks: [],
    reference: {
      referenceName: "",
      link: "",
      refrenece: [],
    },
  },
}) {


  const router = useRouter();
  return (
    <div
      className={classes.wrapper}
      onClick={() => {
        if (!isCaseDetailVariant && routePath) {
          router.push(routePath);
        }
      }}
    >
      {/* Tab Section - Outside the card */}
      {!isStatusVariant && !isCaseDetailVariant && (
        <div className={classes.activeTab}>{data.tabLabel}</div>
      )}

      {/* Card */}
      <div
        className={mergeClass(
          classes.card,
          isStatusVariant || isCaseDetailVariant
            ? classes.isStatusVariantClass
            : ""
        )}
      >
        {/* Edit & Delete - along with each other, top right */}
        {(showEditButton || showDeleteButton) && (
          <div className={classes.cardActionsContainer}>
            {showEditButton && onEditClick && (
              <Button
                label=""
                variant="outlined"
                leftIcon={<FiEdit size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }}
                className={classes.editButton}
              />
            )}
            {showDeleteButton && onDeleteClick && (
              <Button
                label=""
                variant="outlined"
                leftIcon={<RiDeleteBinLine size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
                className={classes.deleteButton}
                aria-label="Delete case"
              />
            )}
          </div>
        )}
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
                  <p>{data?.tabLabel}</p>
                </div>
                <div className={classes.userInfo}>
                  <PiUserCircleFill className={classes.userIcon} />
                  <div className={classes.userName}>{data.clientName}</div>
                </div>
              </div>
              <ProgressBarCircular percentage={data.progress} size={80} />
            </div>
          ) : isCaseDetailVariant ? (
            <div className={classes.userRowAssigned}>
              <div className={classes.staffInfo}>
                <div className={classes.userInfo}>
                  <LuSquareUser className={classes.userIcon} />
                  <div className={classes.assignedHeading}>Assigned Staff</div>
                </div>
                <div className={classes.keyValueDiv}>
                  <span className={classes.keyLabel}>PRIMARY:</span>
                  <p className={classes.staffName}>
                    {data?.primaryStaff || "Unassigned"}
                  </p>
                </div>
                {data?.secondaryStaff && (
                  <div className={classes.keyValueDiv}>
                    <span className={classes.keyLabel}>SECONDARY:</span>
                    <p className={classes.staffName}>{data?.secondaryStaff}</p>
                  </div>
                )}
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
          {!isCaseDetailVariant && (
            <div className={classes.statusRow}>
              <MdOutlineChecklistRtl className={classes.statusIcon} />
              <Status
                label={data.status}
                style={{
                  backgroundColor: data.phaseBgColor,
                  color: data.phaseColor,
                  borderColor: data.phaseBgColor,
                }}
              />
            </div>
          )}
          {/* Trademark Name */}
          <div className={classes.infoRow}>
            <BsPatchCheck className={classes.infoIcon} />
            <span className={classes.infoLabel}>
              Trademark Name -{" "}
              <strong
                className={
                  isStatusVariant ? classes.statusVariantUnderlined : ""
                }
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
                className={
                  isStatusVariant ? classes.statusVariantUnderlined : ""
                }
              >
                {data.trademarkNo}
              </strong>
            </span>
          </div>

          {/* Office Deadline - Show in grid view and case detail */}
          {!isStatusVariant &&
            !isAssignedStaffVariant &&
            data.officeDeadline && (
              <div className={classes.infoRow}>
                <BiCalendar className={classes.infoIcon} />
                <span className={classes.infoLabel}>
                  Office Deadline -{" "}
                  <strong>
                    <RenderDateCell cellValue={data.officeDeadline} />
                  </strong>
                </span>
              </div>
            )}

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
          {/* {(isStatusVariant || isCaseDetailVariant) && (
            <div className={classes.infoRow}>
              <FaRegUser className={classes.infoIcon} />
              <span className={classes.infoLabel}>
                Client Name - <strong>{data.clientName}</strong>
              </span>
            </div>
          )} */}

          {/* Internal Deadline and Office Deadline */}
          {isCaseDetailVariant && (
            <>
              {data.internalDeadline && (
                <div className={classes.infoRow}>
                  <BiCalendar className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    Internal Deadline -{" "}
                    <strong>
                      <RenderDateCell cellValue={data.internalDeadline} />
                    </strong>
                  </span>
                </div>
              )}
              {data.internalDeadline && data.officeDeadline && (
                <div className={classes.deadlineDivider}></div>
              )}
              {data.officeDeadline && (
                <div className={classes.infoRow}>
                  <BiCalendar className={classes.infoIcon} />
                  <span className={classes.infoLabel}>
                    Office Deadline -{" "}
                    <strong>
                      <RenderDateCell cellValue={data.officeDeadline} />
                    </strong>
                  </span>
                </div>
              )}
            </>
          )}

          {/* Tasks */}
          {isCaseDetailVariant && (
            <div className={classes.infoRowDetailed}>
              <MdChecklistRtl
                className={mergeClass(classes.infoIcon, "mt-1")}
              />
              <div className={classes.detailsDiv}>
                <span className={classes.infoLabel}>Tasks</span>
                {(Array.isArray(data.tasks) && data.tasks.length > 0
                  ? data.tasks
                  : []
                ).map((task, idx) => (
                  <span
                    key={idx}
                    className={mergeClass(
                      classes.infoLabel,
                      classes.infoLabelDetail
                    )}
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
          {!isStatusVariant && data?.reference?.reference?.length > 0 && (
            <div className={classes.infoRowDetailed}>
              <RiKeyFill className={classes.infoIcon} />
              <span className={classes.infoLabel}>Reference</span>
              <div className={classes.referenceList}>
                {data.reference.reference.map((item, index) => (
                  <ReferenceTag key={index} label={item} />
                ))}
              </div>
              </div>
          )}

          {data?.reference?.refrenece?.length > 0 && (
            <div className={classes.infoRowDetailed}>
              <span className={classes.infoLabel}>Reference</span>
              {data.reference.refrenece.map((item, index) => (
                <div key={index} className={mergeClass(classes)}>
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
