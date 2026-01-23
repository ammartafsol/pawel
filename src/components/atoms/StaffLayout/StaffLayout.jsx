"use client";
import React, { useState, useEffect, useRef } from "react";
import classes from "./StaffLayout.module.css";
import Sidebar from "@/components/molecules/Sidebar/Sidebar";
import { MdNotifications } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline, IoLogOutOutline, IoMenu } from "react-icons/io5";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signOutRequest } from "@/store/auth/authSlice";
import { clearAllCookies } from "@/resources/utils/cookie";
import { Drawer } from "@mui/material";

const StaffLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const notificationCount = useSelector(
    (state) => state.newNotificationReducer.count
  );
  const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOverlayOpen(false);
      }
    };

    if (isProfileOverlayOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOverlayOpen]);

  // Close drawer when route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleProfileClick = () => {
    setIsProfileOverlayOpen(!isProfileOverlayOpen);
  };

  const handleProfileSettings = () => {
    router.push("/staff/profile-setting");
    setIsProfileOverlayOpen(false);
  };

  const handleLogout = () => {
    clearAllCookies();
    dispatch(signOutRequest());
    router.push("/login");
    setIsProfileOverlayOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div className={classes?.staffLayout}>
      <div className={classes?.sidebarDesktop}>
        <Sidebar />
      </div>
      <div className={classes?.rightSide}>
        {/*  right side header */}
        <div className={classes?.rightSideHeader}>
          <button 
            className={classes?.menuButton}
            onClick={toggleDrawer(true)}
            aria-label="Open menu"
          >
            <IoMenu size={24} color="var(--white)" />
          </button>
          <div className={classes?.mainIcon}>
            <div
              onClick={() => router.push("/staff/notifications")}
              className={classes?.icon}
            >
              <MdNotifications size={22} color="var(--white)" />
              {notificationCount > 0 && (
                <span className={classes?.notificationBadge}>
                  {notificationCount}
                </span>
              )}
            </div>
            <div className={classes?.profileIconWrapper} ref={profileRef}>
              <div
                className={`${classes?.icon} ${isProfileOverlayOpen ? classes?.iconActive : ""}`}
                onClick={handleProfileClick}
              >
                <CgProfile size={22} color="var(--white)" />
              </div>
              {isProfileOverlayOpen && (
                <div className={classes?.profileOverlay}>
                  <div
                    className={classes?.profileOverlayItem}
                    onClick={handleProfileSettings}
                  >
                    <IoSettingsOutline size={18} />
                    <span>Profile Settings</span>
                  </div>
                  <div
                    className={classes?.profileOverlayItem}
                    onClick={handleLogout}
                  >
                    <IoLogOutOutline size={18} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={classes?.rightSideContent}>{children}</div>
      </div>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 293,
          },
        }}
      >
        <div className={classes?.drawerContent}>
          <Sidebar onItemClick={() => setDrawerOpen(false)} />
        </div>
      </Drawer>
    </div>
  );
};

export default StaffLayout;
