"use client";
import React from "react";
import ModalSkeleton from "@/components/organisms/Modals/ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import moment from "moment";
import { BiCalendar, BiFile, BiCheckCircle } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";
import Status from "@/components/atoms/Status/Status";
import classes from "./CalendarEventDetailModal.module.css";

const CalendarEventDetailModal = ({ show, setShow, event }) => {
  const router = useRouter();

  if (!event) return null;

  const handleViewCase = () => {
    if (event.resource?.slug) {
      router.push(`/user/my-cases/${event.resource.slug}`);
      setShow(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MMMM DD, YYYY");
  };

  const formatTime = (date) => {
    if (!date) return "";
    return moment(date).format("h:mm A");
  };

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      heading="Event Details"
      size="md"
      showCloseIcon
    >
      <div className={classes.modalContent}>
        {/* Header Section with Icon */}
        <div className={classes.headerSection}>
          <div className={classes.iconWrapper}>
            <BiCalendar className={classes.calendarIcon} />
          </div>
          <h3 className={classes.eventTitle}>{event.title || "Case Event"}</h3>
        </div>

        {/* Details Grid */}
        <div className={classes.detailsGrid}>
          {/* Deadline Date */}
          <div className={classes.detailItem}>
            <div className={classes.detailLabel}>
              <BiCalendar className={classes.labelIcon} />
              <span>Deadline Date</span>
            </div>
            <div className={classes.detailValue}>
              <p className={classes.dateText}>{formatDate(event.start)}</p>
              {event.start && (
                <span className={classes.timeText}>{formatTime(event.start)}</span>
              )}
            </div>
          </div>

          {/* Deadline Status */}
          {event.resource?.deadlineStatus && (
            <div className={classes.detailItem}>
              <div className={classes.detailLabel}>
                <BiCheckCircle className={classes.labelIcon} />
                <span>Status</span>
              </div>
              <div className={classes.detailValue}>
                <Status 
                  label={event.resource.deadlineStatus} 
                  variant={event.resource.deadlineStatus}
                />
              </div>
            </div>
          )}

          {/* Case Information */}
          {event.resource?.caseId && (
            <div className={classes.detailItem}>
              <div className={classes.detailLabel}>
                <BiFile className={classes.labelIcon} />
                <span>Case ID</span>
              </div>
              <div className={classes.detailValue}>
                <p className={classes.caseIdText}>{event.resource.caseId}</p>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {event.resource?.deadline && (
            <div className={classes.detailItem}>
              <div className={classes.detailLabel}>
                <MdOutlineDescription className={classes.labelIcon} />
                <span>Deadline</span>
              </div>
              <div className={classes.detailValue}>
                <p className={classes.deadlineText}>
                  {formatDate(event.resource.deadline)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {event.resource?.slug && (
          <div className={classes.actionSection}>
            <Button
              label="View Full Case Details"
              variant="primary"
              onClick={handleViewCase}
              className={classes.viewButton}
            />
          </div>
        )}
      </div>
    </ModalSkeleton>
  );
};

export default CalendarEventDetailModal;

