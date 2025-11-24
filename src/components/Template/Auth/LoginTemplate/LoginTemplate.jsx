"use client";
import React, { useState } from "react";
import classes from "./LoginTemplate.module.css";
import AuthWrapper from "@/components/atoms/AuthWrapper/AuthWrapper";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import { LoginSchema } from "@/formik/schema";
import useAxios from "@/interceptor/axios-functions";
import { useDispatch } from "react-redux";
import { loginFormValues } from "@/formik/initialValues";
import { saveLoginUserData } from "@/store/auth/authSlice";
import { setTokenCookie, setUserMetadataCookie } from "@/resources/utils/cookie";
import RenderToast from "@/components/atoms/RenderToast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";

const LoginTemplate = () => {
  const [loading, setLoading] = useState("");
  const { Post } = useAxios();
  const router = useRouter();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: loginFormValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const handleSubmit = async(values) => {
    setLoading("loading");
    const obj = { email: values?.email, password: values?.password };
    const { response } = await Post({ route: "auth/login", data: obj });
  if(response){
    const token = response?.data?.token;
    const user = response?.data?.user;
    dispatch(saveLoginUserData(response?.data));
    setTokenCookie(token);
    setUserMetadataCookie(user);
    RenderToast({
      type: "info",
      message: "Please complete your profile to continue",
    });
    router.push("/sign-up");
    return;
  }
  };
  return (
    <AuthWrapper
      title="Login to your account"
      description="Enter your details to login"
    >
      <div className={classes.loginForm}>
        <div className={classes.inputContainer}>
          <Input type="email" setValue={(e)=>{formik.setFieldValue("email", e)}} error={formik.touched.email && formik.errors.email} value={formik.values.email} label="Email" placeholder="Enter your email" />
          <Input type="password" setValue={(e)=>{formik.setFieldValue("password", e)}} error={formik.touched.password && formik.errors.password} value={formik.values.password} label="Password" placeholder="Enter your password" />
        <div className={classes.buttonContainer}> 
          <div className={classes.forgotPasswordContainer}>
            <Checkbox checked={formik.values.checkbox} error={formik.touched.checkbox && formik.errors.checkbox} onChange={(e)=>{formik.setFieldValue("checkbox", e)}} label="Keep me logged in" />
            <div onClick={()=>{router.push("/forgot-password")}} className={classes.forgotPassword}>Forgot password?</div>
          </div>
          <Button
            variant="primary"
            onClick={()=>{formik.handleSubmit()}}
            label="Sign In"
            className={classes.loginButton}
          />
        </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default LoginTemplate;
