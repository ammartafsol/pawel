"use client";
import React, { useState } from "react";
import classes from "./ForgotPasswordTemplate.module.css";
import AuthWrapper from "@/components/atoms/AuthWrapper/AuthWrapper";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import { ForgotPasswordSchema } from "@/formik/schema";
import { forgotPasswordValues } from "@/formik/initialValues";
import { useFormik } from "formik";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";
import { useRouter } from "next/navigation";
import { setEmailCookie } from "@/resources/utils/cookie";

const ForgotPasswordTemplate = () => {
  const [loading, setLoading] = useState("");
  const { Post } = useAxios();
  const router = useRouter();

  const formik = useFormik({
    initialValues: forgotPasswordValues,
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values) => {
      handleForgotPassword(values);
    },
  });

  const handleForgotPassword = async (values) => {
    setLoading("loading");
    const obj = { email: values?.email };
    const { response } = await Post({ route: "auth/forgot/password", data: obj });
    
    console.log("response?.status === 'success'", response, 'success');
    
    if (response?.status === 'success') {
      setEmailCookie(obj.email);
      RenderToast({ type: "success", message: 'OTP has been sent to your email' });
      router.push('/verify-otp');
      setLoading("");
      return;
    }
    setLoading("");
  };

  return (
    <AuthWrapper
      title="Forgot Password"
      description="Enter your email address and we'll send you a code to reset your password"
    >
      <div className={classes.forgotPasswordForm}>
        <div className={classes.inputContainer}>
          <Input
            type="email"
            setValue={(e) => {
              formik.setFieldValue("email", e);
            }}
            error={formik.touched.email && formik.errors.email}
            value={formik.values.email}
            label="Email"
            placeholder="Enter your email"
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="primary"
            onClick={() => {
              formik.handleSubmit();
            }}
            label={loading === 'loading' ? "Sending..." : "Send"}
            className={classes.sendButton}
            disabled={loading === 'loading'}
            loading={loading === 'loading'}
            showSpinner={true}
          />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default ForgotPasswordTemplate;
