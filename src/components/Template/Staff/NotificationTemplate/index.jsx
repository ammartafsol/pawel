"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  decrementCount,
  resetCount,
} from "@/store/new_notification/newNotification";
import RenderToast from "@/components/atoms/RenderToast";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import { useRouter } from "next/navigation";
import { notificationBtn } from "@/developementContent/Enums/enum";
import useAxios from "@/interceptor/axios-functions";
import { RECORDS_LIMIT } from "@/resources/utils/constant";
import Pagination from "@/components/molecules/Pagination/Pagination";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";

const NotificationTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { Get, Patch } = useAxios();

  const [notifications, setNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(notificationBtn[0]);
  const [markingId, setMarkingId] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState('');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  /* ------------------ Derived State ------------------ */
  const hasUnreadNotifications = useMemo(
    () =>
      notifications.some(
        (n) => !n?.seen && !n?.isRead
      ),
    [notifications]
  );

  /* ------------------ API ------------------ */
  const fetchNotifications = useCallback(
    async (filterValue, pageNo) => {
      setLoading('loading');

      const params = new URLSearchParams({
        limit: String(RECORDS_LIMIT),
        page: String(pageNo),
      });

      // Only add seen parameter if filter is not "all"
      if (filterValue === 'read') {
        params.append('seen', 'true');
      } else if (filterValue === 'unread') {
        params.append('seen', 'false');
      }

      const { response } = await Get({
        route: `notifications?${params.toString()}`,
        showAlert: false,
      });

      if (response) {
        const payload = response?.data ?? response;
        setNotifications(payload?.notifications ?? []);
        setTotalRecords(payload?.totalRecords ?? 0);
      }

      setLoading('');
    },
    [Get]
  );

  /* ------------------ Effects ------------------ */
  useEffect(() => {
    fetchNotifications(selectedFilter.value, page);
  }, [selectedFilter.value, page]);

  /* ------------------ Handlers ------------------ */
  const handleFilterChange = useCallback((filter) => {
    setSelectedFilter(filter);
    setPage(1);
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    if (!hasUnreadNotifications) return;

    setIsMarkingAll(true);

    const { response } = await Get({
      route: "notifications/all/seen",
      showAlert: false,
    });

    if (response) {
      dispatch(resetCount());
      fetchNotifications(selectedFilter.value, page);
      RenderToast({
        type: "success",
        message: "All notifications marked as read",
      });
    }

    setIsMarkingAll(false);
  }, [
    Get,
    dispatch,
    fetchNotifications,
    hasUnreadNotifications,
    page,
    selectedFilter.value,
  ]);

  const handleMarkAsRead = useCallback(
    async (id, e) => {
      e.stopPropagation();
      setMarkingId(id);

      const { response } = await Patch({
        route: `notifications/seen/${id}`,
        showAlert: false,
      });

      if (response) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, seen: true, isRead: true } : n
          )
        );
        dispatch(decrementCount());
        RenderToast({
          type: "success",
          message: "Notification marked as read",
        });
      }

      setMarkingId(null);
    },
    [Patch, dispatch]
  );

  /* ------------------ Icon ------------------ */
  const getIcon = useCallback((type) => {
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
  }, []);

  if (loading) return <SpinnerLoading />;


  /* ------------------ Render ------------------ */
  return (
    <div className="p24">
      <Wrapper
        contentClassName={classes.contentClassName}
        headerComponent={
          <div className={classes.headerContainer}>
            <Button
              className={classes.backButton}
              variant="outlined"
              leftIcon={<IoChevronBack />}
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
              disabled={isMarkingAll}
            >
              {isMarkingAll ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        <div className={classes.notificationList}>
          {notifications.length ? (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`${classes.notificationItem} ${
                    notification?.seen ? "" : classes.unread
                  }`}
                >
                  <div
                    className={`${classes.iconWrapper} ${
                      notification.type ? classes[notification.type] : ""
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

                    {notification?.seen ? null : (
                      <Button
                        label={
                          markingId === notification._id
                            ? "Marking..."
                            : "Mark as read"
                        }
                        variant="light"
                        className={classes.markAsReadBtn}
                        onClick={(e) =>
                          handleMarkAsRead(notification._id, e)
                        }
                        disabled={markingId === notification._id}
                      />
                    )}
                  </div>
                </div>
              ))}

              {totalRecords > RECORDS_LIMIT && (
                <div className={classes.paginationParent}>
                  <Pagination
                    totalRecords={totalRecords}
                    currentPage={page}
                    limit={RECORDS_LIMIT}
                    onPageChange={setPage}
                    showResultsText={false}
                  />
                </div>
              )}
            </>
          ) : (
            <NoDataFound text="No notifications found" />
          )}
        </div>
      </Wrapper>
    </div>
  );
};

export default NotificationTemplate;
