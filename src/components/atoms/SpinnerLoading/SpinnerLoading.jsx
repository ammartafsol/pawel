import React from "react";
import Image from "next/image";
import classes from "./SpinnerLoading.module.css";
import { mergeClass } from "@/resources/utils/helper";

/**
 * SpinnerLoading component
 * @param {Object} param - Component props
 * @param {string} param.className - Additional class names
 * @param {React.CSSProperties} param.style - Inline styles
 * @returns {JSX.Element}
 */
export default function SpinnerLoading({ className, style }) {
  return (
    <div
      className={mergeClass(classes.spinnerContainer, className)}
      style={style}
    >
      <div className={classes.spinnerWrapper}>
        <svg viewBox="0 0 100 100" className={classes.spinner}>
          <defs>
            <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#01615f" stopOpacity="1" />
              <stop offset="50%" stopColor="#1F5CAE" stopOpacity="1" />
              <stop offset="100%" stopColor="#01615f" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            className={classes.spinnerCircle}
            filter="url(#glow)"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="30" 
            className={classes.spinnerCircleInner}
          />
        </svg>
        <div className={classes.logoContainer}>
          <Image 
            src="/app-images/logo.png" 
            alt="logo" 
            width={40} 
            height={40}
            className={classes.logo}
          />
        </div>
        <div className={classes.pulseRing}></div>
      </div>
    </div>
  );
}
