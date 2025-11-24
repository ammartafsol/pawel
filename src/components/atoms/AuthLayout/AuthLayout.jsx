"use client";
import React from "react";
import classes from "./AuthLayout.module.css";
import Image from "next/image";

const AuthLayout = ({ children }) => {
  return (
    <div className={classes.authWrapper}>
      <div className={classes.logoContainer}>
        <div className={classes.logo}>
          <Image src="/app-images/logo.png" alt="logo" fill />
        </div>
      </div>
      <div className={classes.contentContainer}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
