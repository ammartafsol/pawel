import AuthLayout from "@/components/atoms/AuthLayout/AuthLayout";
import React from "react";

const layout = ({ children }) => {
  return (
    <>
      <AuthLayout>{children}</AuthLayout>
    </>
  );
};

export default layout;
