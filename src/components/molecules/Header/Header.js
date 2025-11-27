"use client";
import React, { useState } from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import { Container } from "react-bootstrap";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { BiMenu, BiOutline } from "react-icons/bi";
import { HeaderData } from "@/developementContent/Data/HeaderData/HeaderData";
import { usePathname } from "next/navigation";
import Input from "@/components/atoms/Input/Input";
import { IoSearchSharp } from "react-icons/io5";
import { MdNotifications } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import GenerateTicketModal from "@/components/organisms/Modals/GenerateTicketModal/GenerateTicketModal";
import SearchInput from "@/components/atoms/SearchInput/SearchInput";




const Header = () => {
  const [showGenerateTicketModal, setShowGenerateTicketModal] = useState(false);
  const pathname = usePathname();
  return (
    <header className={styles.header}>
      <Container className="container-fluid">
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo}>
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
            <SearchInput/>
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
              <div className={styles?.icon}>
              <MdNotifications  size={22} color="var(--white)" />
              </div>
              <div className={styles?.icon}>
                <CgProfile size={22} color="var(--white)" />
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
