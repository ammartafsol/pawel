"use client";
import React from "react";
import styles from "./Header.module.css";
import Image from "next/image";
import { Container } from "react-bootstrap";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { BiMenu, BiOutline } from "react-icons/bi";
import { HeaderData } from "@/developementContent/Data/HeaderData/HeaderData";
import { usePathname } from "next/navigation";

const Header = () => {
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
            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Button label="Sign In" variant="outlined" />
              <Button label="Start Free Trial" variant="primary" />
            </div>
          </nav>

          {/* Mobile menu button */}
          <button type="button" className={styles.mobileMenuButton}>
            <BiMenu size={30} />
          </button>
        </div>
      </Container>
    </header>
  );
};

export default Header;
