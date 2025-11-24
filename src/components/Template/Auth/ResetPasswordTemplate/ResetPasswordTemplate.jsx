"use client";
import React, { useState, useEffect } from "react";
import classes from "./ResetPasswordTemplate.module.css";
import AuthWrapper from "@/components/atoms/AuthWrapper/AuthWrapper";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import { ResetPasswordSchema } from "@/formik/schema";
import { resetPasswordValues } from "@/formik/initialValues";
import { useFormik } from "formik";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";
import { useRouter } from "next/navigation";
import { getEmailCookie, getCodeCookie, removeEmailCookie, removeCodeCookie } from "@/resources/utils/cookie";

const ResetPasswordTemplate = () => {
  const [loading, setLoading] = useState("");
  const { Post } = useAxios();
  const router = useRouter();

  // Get email and code from cookies
  const emailFromCookie = getEmailCookie();
  const codeFromCookie = getCodeCookie();

  useEffect(() => {
    // Redirect if email or code is missing
    if (!emailFromCookie || !codeFromCookie) {
      RenderToast({
        type: "error",
        message: "Session expired. Please start the password reset process again.",
      });
      router.push("/forgot-password");
    }
  }, [emailFromCookie, codeFromCookie, router]);

  const formik = useFormik({
    initialValues: resetPasswordValues,
    validationSchema: ResetPasswordSchema,
    onSubmit: (values) => {
      handleResetPassword(values);
    },
  });

  const handleResetPassword = async (values) => {
    if (!emailFromCookie || !codeFromCookie) {
      RenderToast({
        type: "error",
        message: "Session expired. Please start the password reset process again.",
      });
      router.push("/forgot-password");
      return;
    }

    setLoading("loading");

    const payload = {
      email: emailFromCookie,
      code: codeFromCookie,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const { response } = await Post({
      route: "auth/reset/password",
      data: payload,
    });

    if (response?.status === "success") {
      // Clear cookies after successful password reset
      removeEmailCookie();
      removeCodeCookie();
      RenderToast({ type: "success", message: "Password reset successfully" });
      router.push("/login");
      setLoading("");
      return;
    }
    setLoading("");
  };

  return (
    <AuthWrapper
      title="Reset Password"
      description="Enter your new password below"
    >
      <div className={classes.resetPasswordForm}>
        <div className={classes.inputContainer}>
          <Input
            type="password"
            setValue={(e) => {
              formik.setFieldValue("password", e);
            }}
            error={formik.touched.password && formik.errors.password}
            value={formik.values.password}
            label="New Password"
            placeholder="Enter your new password"
          />
          <Input
            type="password"
            setValue={(e) => {
              formik.setFieldValue("confirmPassword", e);
            }}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword}
            value={formik.values.confirmPassword}
            label="Confirm Password"
            placeholder="Confirm your new password"
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="primary"
            onClick={() => {
              formik.handleSubmit();
            }}
            label={loading === "loading" ? "Resetting..." : "Reset Password"}
            className={classes.resetButton}
            disabled={loading === "loading"}
            loading={loading === "loading"}
            showSpinner={true}
          />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ResetPasswordTemplate;

