"use client";
import { useEffect, useState } from "react";
import {
  IoCheckmarkCircle,
  IoInformationCircle,
  IoNotificationsOutline,
  IoChevronBack,
} from "react-icons/io5";
import { MdOutlinePending, MdWarning } from "react-icons/md";
import classes from "./NotificationTemplate.module.css";
import moment from "moment";
import Button from "@/components/atoms/Button";
import { useDispatch } from "react-redux";
import { decrementCount, resetCount } from "@/store/new_notification/newNotification";
import RenderToast from "@/components/atoms/RenderToast";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import { useRouter } from "next/navigation";
import { notificationBtn } from "@/developementContent/Enums/enum";
import { notificationDummyData } from "@/developementContent/Data/dummtData/notificationDummyData";

const NotificationTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [notifications, setNotifications] = useState(notificationDummyData);
  const [selectedFilter, setSelectedFilter] = useState(notificationBtn[0]);
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    // Filter notifications based on selected filter
    let filteredNotifications = notificationDummyData;
    
    if (selectedFilter.value === "unread") {
      filteredNotifications = notificationDummyData.filter(n => !n.isRead);
    } else if (selectedFilter.value === "read") {
      filteredNotifications = notificationDummyData.filter(n => n.isRead);
    }
    
    setNotifications(filteredNotifications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setPage(1); // Reset to first page when filter changes
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <IoCheckmarkCircle size={24} />;
      case "pending":
        return <MdOutlinePending size={24} />;
      case "info":
        return <IoInformationCircle size={24} />;
      case "warning":
        return <MdWarning size={24} />;
      default:
        return <IoNotificationsOutline size={24} />;
    }
  };

  const handleMarkAllRead = () => {
    const hasUnreadNotifications = notifications.some(notification => !notification.isRead);
    
    if (hasUnreadNotifications) {
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true, seen: true })));
      // Reset count to 0 when marking all as read
      dispatch(resetCount());
      RenderToast({
        type: "success",
        message: "All notifications marked as read",
      });
    }
  };

  const handleMarkAsRead = (id, e) => {
    e.stopPropagation(); // Prevent notification click event
    setMarkingId(id);
    
    // Simulate API delay
    setTimeout(() => {
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, seen: true, isRead: true } : notif
        )
      );
      // Decrement count by 1 when marking single notification as read
      dispatch(decrementCount());
      RenderToast({
        type: "success",
        message: "Notification marked as read",
      });
      setMarkingId(null);
    }, 300);
  };

  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);

  return (
    <div className="p24">
      <Wrapper
        contentClassName={classes.contentClassName}
        headerComponent={
          <div className={classes.headerContainer}>
            <Button
              className={classes.backButton}
              variant="outlined"
              leftIcon={<IoChevronBack color="#151529" />}
              label="Back"
              onClick={() => router.back()}
            />
            <h4 className={classes.heading}>Notifications</h4>
          </div>
        }
      >
        <div className={classes.filterSection}>
          <div className={classes.filterLeft}>
            {notificationBtn.map((filter) => (
              <button
                key={filter.value}
                className={`${classes.filterButton} ${
                  selectedFilter.value === filter.value ? classes.active : ""
                }`}
                onClick={() => handleFilterChange(filter)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          {hasUnreadNotifications && (
            <button 
              className={classes.markAllRead} 
              onClick={handleMarkAllRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className={classes.notificationList}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`${classes.notificationItem} ${
                  !notification.isRead ? classes.unread : ""
                }`}
              >
                <div
                  className={`${classes.iconWrapper} ${
                    notification.type === "success"
                      ? classes.success
                      : notification.type === "pending"
                      ? classes.pending
                      : notification.type === "info"
                      ? classes.info
                      : classes.warning
                  }`}
                >
                  {getIcon(notification.type)}
                </div>
                <div className={classes.contentWrapper}>
                  <div className={classes.header}>
                    <h3 className={classes.title}>{notification.title}</h3>
                    <p className={classes.time}>
                      {moment(notification.createdAt).fromNow()}
                    </p>
                  </div>
                  <p className={classes.message}>{notification.message}</p>
                  {!notification.seen && (
                    <Button
                      label={markingId === notification._id ? "Marking..." : "Mark as read"}
                      variant="light"
                      className={classes.markAsReadBtn}
                      onClick={(e) => handleMarkAsRead(notification._id, e)}
                      disabled={markingId === notification._id}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={classes.emptyState}>
              <IoNotificationsOutline
                size={48}
                className={classes.emptyStateIcon}
              />
              <p className={classes.emptyStateText}>No notifications found</p>
            </div>
          )}
       
        </div>
      </Wrapper>
    </div>
  );
};

export default NotificationTemplate;
