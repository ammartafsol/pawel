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
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import GenerateTicketModal from "@/components/organisms/Modals/GenerateTicketModal/GenerateTicketModal";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";
import { useDispatch } from "react-redux";
import { signOutRequest } from "@/store/auth/authSlice";
import { clearAllCookies } from "@/resources/utils/cookie";

const Header = () => {
  const [showGenerateTicketModal, setShowGenerateTicketModal] = useState(false);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
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
          <div onClick={() => router.push("/staff")} className={styles.logo}>
            <Image src="/app-images/logo.png" alt="logo" fill />
          </div>

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
            <SearchInput setValue={setSearchInput} value={searchInput} />
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
    </header>
  );
};

export default Header;
