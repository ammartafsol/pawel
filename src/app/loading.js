"use client";

import React from "react";
import Image from "next/image";

// Full-page loading screen that adapts to light / dark theme
export default function Loading() {

  const backgroundColor = "#ffffff";
  const logoSrc = "/app-images/logo.png";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
        transition: "background-color 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            animation: "loading-pulse 1.6s ease-in-out infinite",
            transformOrigin: "center center",
          }}
        >
          <Image
            src={logoSrc}
            alt="Armando logo"
            width={250}
            height={250}
            priority
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading-pulse {
          0% {
            transform: scale(1);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}

