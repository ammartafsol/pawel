"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import { Container } from "react-bootstrap";
import Link from "next/link";
import { HeaderData } from "@/developementContent/Data/HeaderData/HeaderData";
import { usePathname, useRouter } from "next/navigation";
import { MdNotifications } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline, IoLogOutOutline, IoMenu, IoCloseOutline } from "react-icons/io5";
import GenerateTicketModal from "@/components/organisms/Modals/GenerateTicketModal/GenerateTicketModal";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import { signOutRequest } from "@/store/auth/authSlice";
import { clearAllCookies } from "@/resources/utils/cookie";
import { Drawer } from "@mui/material";

const Header = () => {
  const [showGenerateTicketModal, setShowGenerateTicketModal] = useState(false);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const notificationCount = useSelector(
    (state) => state.newNotificationReducer.count
  );
  const profileRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        overlayRef.current &&
        !profileRef.current.contains(event.target) &&
        !overlayRef.current.contains(event.target)
      ) {
        setShowProfileOverlay(false);
      }
    };

    if (showProfileOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileOverlay]);

  // Close drawer when route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProfileClick = () => {
    setShowProfileOverlay(!showProfileOverlay);
  };

  const handleProfileSettings = () => {
    router.push("/user/profile-setting");
    setShowProfileOverlay(false);
  };

  const handleLogout = () => {
    clearAllCookies();
    dispatch(signOutRequest());
    router.push("/login");
    setShowProfileOverlay(false);
  };
  return (
    <header className={styles.header}>
      <Container className="container-fluid">
        <div className={styles.headerContent}>
          {/* Logo */}
          <div onClick={() => router.push("/user")} className={styles.logo}>
            <Image src="/app-images/logo.png" alt="logo" fill />
          </div>

          {/* Menu Button for Mobile */}
          <button 
            className={styles.menuButton}
            onClick={toggleDrawer(true)}
            aria-label="Open menu"
          >
            <IoMenu size={24} color="var(--charcoal-night)" />
          </button>

          {/* Navigation Menu */}
          <nav className={styles.nav}>
            {HeaderData.map((item) => {
              const isActive = pathname === item.href;
              return(
                (
                  <Link href={item.href} className={`${styles.navLink} ${isActive && styles.active}`} key={item.id}>
                    {item.name}
                  </Link>
                  
                 )
              )
            })}
            {/* //// search */}
            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              {/* message  */}
              <div onClick={() => setShowGenerateTicketModal(true)} className={styles.message}>
                <div className={styles.messageIcon}>
                  <Image src={"/app-images/messageIcon.png"} alt="message" fill />
                </div>
                <h4>We&apos;re here to help</h4>
              </div>
            </div>
            <div className={styles.mainIcon}>
              <div 
                className={styles?.icon}
                onClick={() => router.push("/user/notifications")}
              >
                <MdNotifications size={22} color="var(--white)" />
                {notificationCount > 0 && (
                  <span className={styles?.notificationBadge}>
                    {notificationCount}
                  </span>
                )}
              </div>
              <div className={styles?.profileIconWrapper} ref={profileRef}>
                <div
                  className={`${styles?.icon} ${showProfileOverlay ? styles?.iconActive : ""}`}
                  onClick={handleProfileClick}
                >
                  <CgProfile size={22} color="var(--white)" />
                </div>
                {showProfileOverlay && (
                  <div className={styles?.profileOverlay} ref={overlayRef}>
                    <div
                      className={styles?.profileOverlayItem}
                      onClick={handleProfileSettings}
                    >
                      <IoSettingsOutline size={18} />
                      <span>Profile Settings</span>
                    </div>
                    <div
                      className={`${styles?.profileOverlayItem} ${styles?.logoutItem}`}
                      onClick={handleLogout}
                    >
                      <IoLogOutOutline size={18} />
                      <span>Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <GenerateTicketModal show={showGenerateTicketModal} setShow={setShowGenerateTicketModal} />
        </div>
      </Container>
      
      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
      >
        <div className={styles.drawerContent}>
          <div className={styles.drawerHeader}>
            <div onClick={() => router.push("/user")} className={styles.drawerLogo}>
              <Image src="/app-images/logo.png" alt="logo" fill />
            </div>
            <button 
              className={styles.drawerCloseButton}
              onClick={toggleDrawer(false)}
              aria-label="Close menu"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
          <nav className={styles.drawerNav}>
            {HeaderData.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  href={item.href} 
                  className={`${styles.drawerNavLink} ${isActive && styles.drawerActive}`} 
                  key={item.id}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
           
            <div 
              onClick={() => {
                setShowGenerateTicketModal(true);
                setDrawerOpen(false);
              }} 
              className={styles.drawerMessage}
            >
              <div className={styles.messageIcon}>
                <Image src={"/app-images/messageIcon.png"} alt="message" fill />
              </div>
              <h4>We&apos;re here to help</h4>
            </div>
          </nav>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
