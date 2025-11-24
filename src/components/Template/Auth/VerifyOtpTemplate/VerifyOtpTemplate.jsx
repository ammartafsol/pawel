"use client";
import React, { useState, useEffect } from "react";
import classes from "./VerifyOtpTemplate.module.css";
import AuthWrapper from "@/components/atoms/AuthWrapper/AuthWrapper";
import OtpInput from "@/components/atoms/OtpInput/OtpInput";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import RenderToast from "@/components/atoms/RenderToast";
import Cookies from "js-cookie";
import useAxios from "@/interceptor/axios-functions";
import { useDispatch, useSelector } from "react-redux";
import { getEmailCookie, setCodeCookie } from "@/resources/utils/cookie";

const VerifyOtpTemplate = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { Post } = useAxios();
  const userEmail = useSelector((state) => state.authReducer?.user?.email);

  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const fromForgotPassword = Cookies.get("_xpdx_ver") ? false : true;

  // Get email from cookie first, then fallback to Redux
  const emailFromCookie = getEmailCookie();
  const email = emailFromCookie || userEmail;

  useEffect(() => {
    if (!email) {
      RenderToast({
        type: "error",
        message: "Email not found. Please try the forgot password process again.",
      });
      router.push("/forgot-password");
      return;
    }
  }, [email, router]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async () => {
    setErrorMessage("");
    setLoading("loading");

    if (otp.length !== 6 || otp.split("").some((v) => v === "")) {
      setLoading("");
      setErrorMessage("Please fill in all OTP fields.");
      return;
    }

    const obj = {
      email: email,
      code: otp,
      fromForgotPassword,
    };

    console.log("obj", obj);
    const { response } = await Post({ route: "auth/verify/otp", data: obj });

    if (response) {
      if (!fromForgotPassword) {
        Cookies.remove("_xpdx_ver");
        router.push("/auth/sign-in");
      } else {
        setCodeCookie(obj.code);
        router.push("/reset-password");
      }
      RenderToast({ type: "success", message: "OTP verified successfully" });
      setCanResend(false);
    }
    setLoading("");
  };

  const handleResendOTP = async () => {
    if (loading) return;

    if (!email) {
      RenderToast({
        type: "error",
        message: "Email not found. Please try the forgot password process again.",
      });
      return;
    }

    const obj = {
      email: email,
      fromForgotPassword: fromForgotPassword,
    };

    setLoading("otp");
    const { response } = await Post({ route: "auth/resend/otp", data: obj });
    setLoading("");

    if (response) {
      setOtp("");
      RenderToast({ type: "info", message: "OTP resent successfully" });
      setTimer(60);
      setCanResend(false);
    }
  };

  return (
    <AuthWrapper
      title="Email Verification"
      description="Enter the verification code sent to your email address"
    >
      <div className={classes.verifyOtpForm}>
        <div className={classes.otpContainer}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            length={6}
            disabled={loading === "loading"}
          />
        </div>

        <div className={classes.timerContainer}>
          {timer > 0 ? (
            <div className={classes.timerWrapper}>
              <span className={classes.timerIcon} role="img" aria-label="hourglass">
                ⏳
              </span>
              <span className={classes.timerText}>
                <span className={classes.timerNumber}>{timer}</span>
                <span className={classes.timerSec}> sec</span>
              </span>
            </div>
          ) : (
            <div className={classes.resendContainer}>
              <span className={classes.resendPrompt}>Didn't get the code?</span>
              <span
                className={`${classes.resendLink} ${
                  canResend ? classes.resendLinkActive : classes.resendLinkDisabled
                }`}
                onClick={canResend ? handleResendOTP : undefined}
              >
                {loading === "otp" ? (
                  <span className={classes.sendingAnim}>
                    <span className={classes.dot}>.</span>
                    <span className={classes.dot}>.</span>
                    <span className={classes.dot}>.</span>
                  </span>
                ) : (
                  "Resend"
                )}
              </span>
            </div>
          )}
        </div>

        {errorMessage && <p className={classes.errorMessage}>*{errorMessage}</p>}

        <div className={classes.buttonContainer}>
          <Button
            variant="primary"
            onClick={handleSubmit}
            label={loading === "loading" ? "Verifying..." : "Verify"}
            className={classes.verifyButton}
            disabled={loading === "loading"}
            loading={loading === "loading"}
            showSpinner={true}
          />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default VerifyOtpTemplate;

