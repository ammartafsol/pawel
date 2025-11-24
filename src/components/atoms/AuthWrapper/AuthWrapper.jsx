import React from "react";
import classes from "./AuthWrapper.module.css";
import Image from "next/image";

const AuthWrapper = ({ children,title="",description="" }) => {
  return (
    <div className={classes.authWrapper}>
      <div className={classes.authHeader}>
        <div className={classes.logoContainer}>
          <Image
            src="/app-images/loginIcon.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthWrapper;
